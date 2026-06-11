import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'frederic.lossignol@airskill.fr' },
      {
        fullName: 'Frederic Lossignol',
        password: 'Password123!', // Mot de passe temporaire
      }
    )
  }
}