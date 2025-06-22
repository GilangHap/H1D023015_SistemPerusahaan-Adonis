import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'absensis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('pegawai_id').unsigned().notNullable()
      table.date('tanggal').notNullable()
      table.time('jam_masuk').nullable()
      table.time('jam_pulang').nullable()
      table.enum('status', ['hadir', 'terlambat', 'cuti', 'alpa']).notNullable()
      table.string('keterangan').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Foreign key constraint
      table.foreign('pegawai_id').references('id').inTable('pegawais').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
