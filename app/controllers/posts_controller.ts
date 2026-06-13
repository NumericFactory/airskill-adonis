import fs from 'node:fs'
import Post from '#models/post'
import Category from '#models/category'
import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '#validators/post_validator'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

function sanitizeContent(html: string): string {
    return html
        .replace(/href="(["']+)(https?:\/\/[^"]+?)(["']+)"/g, 'href="$2"')
        .replace(/&nbsp;/g, ' ')
}

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
    public async show({ view, params, response }: HttpContext) {
        const post = await Post.query()
            .where('slug', params.slug)
            .where('status', 'published')
            .preload('user')
            .preload('category')
            .first()

        if (!post) {
            return response.abort({ message: 'Article introuvable' }, 404)
        }

        const expectedCategory = post.category?.slug ?? 'non-classe'
        if (params.categorySlug !== expectedCategory) {
            return response.redirect().status(301).toPath(`/blog/${expectedCategory}/${post.slug}`)
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

        const thumbnailFile = request.file('thumbnail_file', { size: '20mb' })

        let thumbnail: string | undefined

        if (thumbnailFile) {
            if (thumbnailFile.type !== 'image') {
                return response.redirect().back()
            }
            const uploadsDir = app.publicPath('uploads/thumbnails')
            fs.mkdirSync(uploadsDir, { recursive: true })
            const ext = thumbnailFile.extname?.toLowerCase() ?? thumbnailFile.subtype
            const fileName = `${cuid()}.${ext}`
            await thumbnailFile.move(uploadsDir, { name: fileName })
            thumbnail = `/uploads/thumbnails/${fileName}`
        }

        await Post.create({
            ...data,
            content: sanitizeContent(data.content),
            thumbnail,
            userId: auth.user!.id,
            publishedAt:
                data.status === 'published'
                    ? (data.publishedAt ? DateTime.fromJSDate(data.publishedAt) : DateTime.now())
                    : null,
        })

        return response.redirect().toRoute('admin.blog.index')
    }

    /**
     * GET /admin/blog/:id/edit — formulaire édition
     */
    public async edit({ view, params, response, auth }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return response.abort({ message: 'Article introuvable' }, 404)
        if (post.userId !== auth.user!.id) return response.abort({ message: 'Non autorisé' }, 403)

        const categories = await Category.all()
        return view.render('pages/admin/blog/edit', { post, categories })
    }

    /**
     * PUT /admin/blog/:id — mettre à jour un article
     */
    public async update({ request, response, params, auth }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return response.abort({ message: 'Article introuvable' }, 404)
        if (post.userId !== auth.user!.id) return response.abort({ message: 'Non autorisé' }, 403)

        const data = await request.validateUsing(updatePostValidator)

        const thumbnailFile = request.file('thumbnail_file', { size: '20mb' })

        if (thumbnailFile) {
            if (thumbnailFile.type !== 'image') {
                return response.redirect().back()
            }
            const uploadsDir = app.publicPath('uploads/thumbnails')
            fs.mkdirSync(uploadsDir, { recursive: true })
            const ext = thumbnailFile.extname?.toLowerCase() ?? thumbnailFile.subtype
            const fileName = `${cuid()}.${ext}`
            await thumbnailFile.move(uploadsDir, { name: fileName })
            post.thumbnail = `/uploads/thumbnails/${fileName}`
        }

        const { publishedAt, ...rest } = data

        if (data.status === 'published' && post.status === 'draft' && !post.publishedAt) {
            post.publishedAt = publishedAt ? DateTime.fromJSDate(publishedAt) : DateTime.now()
        }

        post.merge({ ...rest, content: rest.content ? sanitizeContent(rest.content) : rest.content })
        await post.save()

        return response.redirect().toRoute('admin.blog.index')
    }

    /**
     * DELETE /admin/blog/:id — supprimer un article
     */
    public async destroy({ response, params, auth }: HttpContext) {
        const post = await Post.find(params.id)
        if (!post) return response.abort({ message: 'Article introuvable' }, 404)
        if (post.userId !== auth.user!.id) return response.abort({ message: 'Non autorisé' }, 403)

        await post.delete()
        return response.redirect().toRoute('admin.blog.index')
    }
}