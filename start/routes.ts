/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')
router.on('mentions-legales').render('pages/legal')
router.get('blog', '#controllers/posts_controller.index')
router.get('formations', '#controllers/formations_controller.index').as('courses.index')
router.get('formations/:name/:id', '#controllers/formations_controller.show').as('courses.show')
router.get('formations/:categoryname', '#controllers/formations_controller.indexByCategory').as('courses.indexbycategory')
