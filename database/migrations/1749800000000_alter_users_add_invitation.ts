import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('invitation_token', 100).nullable().after('role')
      table.timestamp('invitation_expires_at').nullable().after('invitation_token')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('invitation_token')
      table.dropColumn('invitation_expires_at')
    })
  }
}
