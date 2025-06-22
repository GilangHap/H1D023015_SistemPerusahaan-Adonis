import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pegawais'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nip').unique()
      table.string('nama')
      table.string('password')
      table.integer('jabatan_id')
        .unsigned()
        .references('id')
        .inTable('jabatans')
        .onDelete('CASCADE')
      table.integer('unit_kerja_id')
        .unsigned()
        .references('id')
        .inTable('unit_kerjas')
        .onDelete('CASCADE')
      table.decimal('gaji_pokok', 12, 2)
      table.string('email').unique().nullable()
      table.string('no_telp').nullable()
      table.string('alamat').nullable()
      table.string('foto_profil').nullable()
      table.string('remember_token').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
