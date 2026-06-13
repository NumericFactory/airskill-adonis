import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const updateRoleValidator = vine.compile(
  vine.object({
    role: vine.enum(['admin', 'teacher', 'school'] as const),
  })
)

const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().email(),
    role: vine.enum(['admin', 'teacher', 'school'] as const),
  })
)

export default class UsersController {
  public async index({ view }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')
    return view.render('pages/admin/users/index', { users })
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/admin/users/create')
  }

  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.redirect().back()
    }

    const user = new User()
    user.fullName = data.fullName
    user.email = data.email
    user.role = data.role
    user.password = 'PENDING_' + Date.now()

    const token = user.generateInvitationToken()
    await user.save()

    return response.redirect().toRoute('admin.users.invitation', { token })
  }

  public async showInvitation({ view, params, response, request }: HttpContext) {
    const user = await User.findBy('invitationToken', params.token)
    if (!user) return response.abort({ message: 'Invitation introuvable' }, 404)

    const invitationUrl = `${request.protocol()}://${request.host()}/invitation/${params.token}`
    return view.render('pages/admin/users/invitation', { user, token: params.token, invitationUrl })
  }

  public async update({ request, response, params, auth }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.abort({ message: 'Utilisateur introuvable' }, 404)

    if (user.id === auth.user!.id) {
      return response.redirect().back()
    }

    const { role } = await request.validateUsing(updateRoleValidator)
    user.role = role
    await user.save()

    return response.redirect().toRoute('admin.users.index')
  }

  public async destroy({ response, params, auth }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.abort({ message: 'Utilisateur introuvable' }, 404)

    if (user.id === auth.user!.id) {
      return response.redirect().back()
    }

    await user.delete()
    return response.redirect().toRoute('admin.users.index')
  }
}
