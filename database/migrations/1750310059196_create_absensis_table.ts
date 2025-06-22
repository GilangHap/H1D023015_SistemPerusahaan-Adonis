import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cutis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('pegawai_id')
        .unsigned()
        .references('id')
        .inTable('pegawais')
        .onDelete('CASCADE')
      table.date('tanggal_mulai')
      table.date('tanggal_akhir')
      table.integer('jumlah_hari')
      table.text('alasan')
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')
      table
        .integer('approved_by')
        .unsigned()
        .references('id')
        .inTable('pegawais')
        .nullable()
        .onDelete('SET NULL')
      table.text('catatan').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
