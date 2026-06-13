import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Post from './post.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare role: 'admin' | 'teacher' | 'school'

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare invitationToken: string | null

  @column.dateTime()
  declare invitationExpiresAt: DateTime | null

  generateInvitationToken() {
    this.invitationToken = crypto.randomBytes(32).toString('hex')
    this.invitationExpiresAt = DateTime.now().plus({ days: 7 })
    return this.invitationToken
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}