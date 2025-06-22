import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

export default class Jabatan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaJabatan: string

  @column()
  declare tunjangan: number

  @column()
  declare roleId: number

  @belongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Role>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
