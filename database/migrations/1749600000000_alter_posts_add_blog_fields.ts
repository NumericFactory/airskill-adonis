import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'posts'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('slug').unique().notNullable().defaultTo('')
            table.text('excerpt').nullable()
            table.string('thumbnail').nullable()
            table.enum('status', ['draft', 'published']).defaultTo('draft').notNullable()
            table.timestamp('published_at').nullable()
            table
                .integer('category_id')
                .unsigned()
                .nullable()
                .references('id')
                .inTable('categories')
                .onDelete('SET NULL')
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('slug')
            table.dropColumn('excerpt')
            table.dropColumn('thumbnail')
            table.dropColumn('status')
            table.dropColumn('published_at')
            table.dropColumn('category_id')
        })
    }
}
