import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pegawai from './pegawai.js'

export default class Absensi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pegawai_id: number

  @column.date()
  declare tanggal: DateTime

  @column()
  declare jam_masuk: string | null

  @column()
  declare jam_pulang: string | null

  @column()
  declare status: 'hadir' | 'terlambat' | 'cuti' | 'alpa'

  @column()
  declare keterangan: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Pegawai, { foreignKey: 'pegawai_id' })
  declare pegawai: BelongsTo<typeof Pegawai>
}
