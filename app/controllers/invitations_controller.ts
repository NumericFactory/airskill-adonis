import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

const acceptInvitationValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8),
    passwordConfirm: vine.string(),
  })
)

export default class InvitationsController {
  public async show({ view, params }: HttpContext) {
    const user = await User.findBy('invitationToken', params.token)

    if (!user || !user.invitationExpiresAt || user.invitationExpiresAt < DateTime.now()) {
      return view.render('pages/auth/invitation_expired')
    }

    return view.render('pages/auth/invitation', { token: params.token, user })
  }

  public async accept({ request, response, params, auth }: HttpContext) {
    const user = await User.findBy('invitationToken', params.token)

    if (!user || !user.invitationExpiresAt || user.invitationExpiresAt < DateTime.now()) {
      return response.abort({ message: 'Invitation invalide ou expirée' }, 410)
    }

    const data = await request.validateUsing(acceptInvitationValidator)

    if (data.password !== data.passwordConfirm) {
      return response.redirect().back()
    }

    user.password = data.password
    user.invitationToken = null
    user.invitationExpiresAt = null
    await user.save()

    await auth.use('web').login(user)
    return response.redirect().toRoute('admin.dashboard')
  }
}
