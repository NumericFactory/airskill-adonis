import Post from '#models/post'
import Category from '#models/category'
import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '#validators/post_validator'
import { DateTime } from 'luxon'

export default class PostsController {
    /**
     * GET /blog — liste paginée des articles publiés
     */
    public async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const categorySlug = request.input('category')

        const query = Post.query()
            .where('status', 'published')
            .preload('user')
            .preload('category')
            .orderBy('published_at', 'desc')

        if (categorySlug) {
            query.whereHas('category', (q) => q.where('slug', categorySlug))
        }

        const posts = await query.paginate(page, 9)
        const categories = await Category.all()

        return view.render('pages/blog', { posts, categories, currentCategory: categorySlug })
    }

    /**
     * GET /blog/:slug — détail d'un article
     */
    public async show({ view, params, abort }: HttpContext) {
        const post = await Post.query()
            .where('slug', params.slug)
            .where('status', 'published')
            .preload('user')
            .preload('category')
            .first()

        if (!post) {
            return abort(404)
        }

        return view.render('pages/blog/show', { post })
    }

    /**
     * GET /admin/blog — liste admin (tous statuts)
     */
    public async adminIndex({ view }: HttpContext) {
        const posts = await Post.query()
            .preload('user')
            .preload('category')
            .orderBy('created_at', 'desc')

        return view.render('pages/admin/blog/index', { posts })
    }

    /**
     * GET /admin/blog/create — formulaire création
     */
    public async create({ view }: HttpContext) {
        const categories = await Category.all()
        return view.render('pages/admin/blog/create', { categories })
    }

    /**
     * POST /admin/blog — enregistrer un article
     */
    public async store({ request, response, auth }: HttpContext) {
        const data = await request.validateUsing(createPostValidator)

        const post = await Post.create({
            ...data,
            userId: auth.user!.id,
            publishedAt:
                data.status === 'published'
                    ? (data.publishedAt ? DateTime.fromJSDate(data.publishedAt) : DateTime.now())
                    : null,
        })

        return response.redirect().toRoute('blog.show', { slug: post.slug })
    }

    /**
     * GET /admin/blog/:id/edit — formulaire édition
     */
    public async edit({ view, params, abort }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return abort(404)

        const categories = await Category.all()
        return view.render('pages/admin/blog/edit', { post, categories })
    }

    /**
     * PUT /admin/blog/:id — mettre à jour un article
     */
    public async update({ request, response, params, abort }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return abort(404)

        const data = await request.validateUsing(updatePostValidator)

        if (data.status === 'published' && post.status === 'draft' && !post.publishedAt) {
            post.publishedAt = DateTime.now()
        }

        post.merge(data)
        await post.save()

        return response.redirect().toRoute('blog.show', { slug: post.slug })
    }

    /**
     * DELETE /admin/blog/:id — supprimer un article
     */
    public async destroy({ response, params, abort }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return abort(404)

        await post.delete()
        return response.redirect().toRoute('blog.index')
    }
}