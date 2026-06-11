import Category from '#models/category'
import { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'

export default class CategoriesController {
  /**
   * GET /admin/categories — liste des catégories
   */
  public async index({ view }: HttpContext) {
    const categories = await Category.query().withCount('posts').orderBy('title', 'asc')
    return view.render('pages/admin/categories/index', { categories })
  }

  /**
   * GET /admin/categories/create — formulaire création
   */
  public async create({ view }: HttpContext) {
    return view.render('pages/admin/categories/create')
  }

  /**
   * POST /admin/categories — enregistrer une catégorie
   */
  public async store({ request, response, session }: HttpContext) {
    const { title, description } = request.only(['title', 'description'])
    const slug = string.slug(title, { lower: true, strict: true })

    await Category.create({ title, slug, description: description || null })

    session.flash('success', 'Catégorie créée avec succès.')
    return response.redirect().toRoute('admin.categories.index')
  }

  /**
   * GET /admin/categories/:id/edit — formulaire édition
   */
  public async edit({ view, params, response }: HttpContext) {
    const category = await Category.find(params.id)
    if (!category) return response.abort({ message: 'Catégorie introuvable' }, 404)
    return view.render('pages/admin/categories/edit', { category })
  }

  /**
   * PUT /admin/categories/:id — mettre à jour une catégorie
   */
  public async update({ request, response, params, session }: HttpContext) {
    const category = await Category.find(params.id)
    if (!category) return response.abort({ message: 'Catégorie introuvable' }, 404)

    const { title, description } = request.only(['title', 'description'])
    category.title = title
    category.slug = string.slug(title, { lower: true, strict: true })
    category.description = description || null
    await category.save()

    session.flash('success', 'Catégorie mise à jour.')
    return response.redirect().toRoute('admin.categories.index')
  }

  /**
   * DELETE /admin/categories/:id — supprimer une catégorie
   */
  public async destroy({ response, params, session }: HttpContext) {
    const category = await Category.find(params.id)
    if (!category) return response.abort({ message: 'Catégorie introuvable' }, 404)

    await category.delete()
    session.flash('success', 'Catégorie supprimée.')
    return response.redirect().toRoute('admin.categories.index')
  }
}
