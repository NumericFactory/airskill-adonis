import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: ('admin' | 'teacher' | 'school')[] }) {
    const user = ctx.auth.user

    if (!user || !options.roles.includes(user.role)) {
      return ctx.response.abort({ message: 'Accès refusé' }, 403)
    }

    return next()
  }
}
