/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.on('/').render('pages/home').as('home')
router.on('mentions-legales').render('pages/legal')

// ─── Blog public ───────────────────────────────────────────────────────────
router.get('/blog', '#controllers/posts_controller.index').as('blog.index')
router.get('/blog/:slug', '#controllers/posts_controller.show').as('blog.show')

// ─── Formations ────────────────────────────────────────────────────────────
router.get('formations', '#controllers/formations_controller.index').as('courses.index')
router.get('formations/:name/:id', '#controllers/formations_controller.show').as('courses.show')
router.get('formations/:categoryname', '#controllers/formations_controller.indexByCategory').as('courses.indexbycategory')

// ─── Authentification ────────────────────────────────────────────────────────
router.get('/login', '#controllers/session_controller.create').as('login.create')
router.post('/login', '#controllers/session_controller.store').as('login.store')
router.post('/logout', '#controllers/session_controller.destroy').as('login.destroy').use(middleware.auth())

// ─── Admin blog (authentifié) ───────────────────────────────────────────────
router
    .group(() => {
        router.get('/blog', '#controllers/posts_controller.adminIndex').as('admin.blog.index')
        router.get('/blog/create', '#controllers/posts_controller.create').as('admin.blog.create')
        router.post('/blog', '#controllers/posts_controller.store').as('admin.blog.store')
        router.get('/blog/:id/edit', '#controllers/posts_controller.edit').as('admin.blog.edit')
        router.put('/blog/:id', '#controllers/posts_controller.update').as('admin.blog.update')
        router.delete('/blog/:id', '#controllers/posts_controller.destroy').as('admin.blog.destroy')
    })
    .prefix('/admin')
    .use(middleware.auth())

