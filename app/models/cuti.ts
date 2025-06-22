import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pegawai from './pegawai.js'

export default class Cuti extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pegawai_id: number

  @column.dateTime()
  declare tanggal_mulai: DateTime

  @column.dateTime()
  declare tanggal_akhir: DateTime

  @column()
  declare jumlah_hari: number

  @column()
  declare alasan: string

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare approved_by: number | null

  @column()
  declare catatan: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Pegawai, { foreignKey: 'pegawai_id' })
  declare pegawai: BelongsTo<typeof Pegawai>

  @belongsTo(() => Pegawai, { foreignKey: 'approved_by' })
  declare approver: BelongsTo<typeof Pegawai>
}
