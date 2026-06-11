import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  /**
   * Afficher le formulaire de connexion
   */
  public async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Traiter la soumission du formulaire de connexion
   */
  public async store({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // VerifyCredentials cherche l'utilisateur et vérifie le mot de passe (via Hash)
      const user = await User.verifyCredentials(email, password)

      // Connecter l'utilisateur dans la session web
      await auth.use('web').login(user)

      // Rediriger vers le dashboard admin
      return response.redirect().toRoute('admin.dashboard')
    } catch (error) {
      session.flash('error', 'Identifiants incorrects. Veuillez réessayer.')
      return response.redirect().back()
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  public async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
