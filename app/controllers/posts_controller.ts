// import type { HttpContext } from '@adonisjs/core/http'

import Post from "#models/post"

export default class PostsController {

    public async index({ view }: any) {
        const posts = await Post.query().preload('user')
        console.log(posts)
        return view.render('pages/blog', { posts })
    }

    // public async show(id:number, { view }: any) {
    //     const post = await Post.find(id)
    //     return view.render('posts/show')
    // }

    // public async create({ view }) {
    //     return view.render('posts/create')
    // }

    // public async store({ response }) {
    //     response.redirect().toRoute('posts.index')
    // }

    // public async edit({ view }) {
    //     return view.render('posts/edit')
    // }

    // public async update({ response }) {
    //     response.redirect().toRoute('posts.index')
    // }

    // public async destroy({ response }) {
    //     response.redirect().toRoute('posts.index')
    // }
}