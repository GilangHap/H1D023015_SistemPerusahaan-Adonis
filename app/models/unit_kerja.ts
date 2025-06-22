import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class UnitKerja extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaUnit: string

  @column()
  declare lokasi: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
