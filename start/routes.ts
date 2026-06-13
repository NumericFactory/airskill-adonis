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
router.get('/blog/:categorySlug/:slug', '#controllers/posts_controller.show').as('blog.show')

// ─── Formations ────────────────────────────────────────────────────────────
router.get('formations', '#controllers/formations_controller.index').as('courses.index')
router.get('formations/:name/:id', '#controllers/formations_controller.show').as('courses.show')
router.get('formations/:categoryname', '#controllers/formations_controller.indexByCategory').as('courses.indexbycategory')

// ─── Authentification ────────────────────────────────────────────────────────
router.get('/login', async ({ response, auth, view }) => {
  // Si déjà connecté, rediriger vers l'admin
  const isAuthenticated = await auth.check()
  if (isAuthenticated) {
    return response.redirect().toRoute('admin.dashboard')
  }
  return view.render('pages/auth/login')
}).as('login.create')
router.post('/login', '#controllers/session_controller.store').as('login.store')
router.post('/logout', '#controllers/session_controller.destroy').as('login.destroy').use(middleware.auth())

// ─── Admin (admin + teacher + school) ────────────────────────────────────────
router
  .group(() => {
    router.get('/', '#controllers/admin_controller.index').as('admin.dashboard')
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.role({ roles: ['admin', 'teacher', 'school'] })])

// ─── Admin blog (admin + teacher) ────────────────────────────────────────────
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
    .use([middleware.auth(), middleware.role({ roles: ['admin', 'teacher'] })])

// ─── Admin utilisateurs (admin uniquement) ───────────────────────────────────
router
    .group(() => {
        router.get('/users', '#controllers/users_controller.index').as('admin.users.index')
        router.get('/users/create', '#controllers/users_controller.create').as('admin.users.create')
        router.post('/users', '#controllers/users_controller.store').as('admin.users.store')
        router.get('/users/invitation/:token', '#controllers/users_controller.showInvitation').as('admin.users.invitation')
        router.put('/users/:id', '#controllers/users_controller.update').as('admin.users.update')
        router.delete('/users/:id', '#controllers/users_controller.destroy').as('admin.users.destroy')
    })
    .prefix('/admin')
    .use([middleware.auth(), middleware.role({ roles: ['admin'] })])

// ─── Invitations (public) ─────────────────────────────────────────────────────
router.get('/invitation/:token', '#controllers/invitations_controller.show').as('invitation.show')
router.post('/invitation/:token', '#controllers/invitations_controller.accept').as('invitation.accept')

// ─── Admin catégories (admin uniquement) ─────────────────────────────────────
router
    .group(() => {
        router.get('/categories', '#controllers/categories_controller.index').as('admin.categories.index')
        router.get('/categories/create', '#controllers/categories_controller.create').as('admin.categories.create')
        router.post('/categories', '#controllers/categories_controller.store').as('admin.categories.store')
        router.get('/categories/:id/edit', '#controllers/categories_controller.edit').as('admin.categories.edit')
        router.put('/categories/:id', '#controllers/categories_controller.update').as('admin.categories.update')
        router.delete('/categories/:id', '#controllers/categories_controller.destroy').as('admin.categories.destroy')
    })
    .prefix('/admin')
    .use([middleware.auth(), middleware.role({ roles: ['admin'] })])

