import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, computed, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import Jabatan from './jabatan.js'
import UnitKerja from './unit_kerja.js'
import Absensi from './absensi.js'
import Cuti from './cuti.js'

export default class Pegawai extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nip: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare nama: string

  @column()
  declare jabatanId: number

  @column()
  declare unitKerjaId: number

  @column()
  declare gajiPokok: number

  @column()
  declare email: string | null

  @column()
  declare noTelp: string | null

  @column()
  declare alamat: string | null

  @column()
  declare fotoProfil: string | null

  @column()
  declare rememberToken: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPasswordIfNeeded(pegawai: Pegawai) {
    if (pegawai.$dirty.password) {
      pegawai.password = await hash.make(pegawai.password)
    }
  }

  async verifyPassword(plainPassword: string) {
    return await hash.verify(this.password, plainPassword)
  }

  @belongsTo(() => Jabatan)
  declare jabatan: BelongsTo<typeof Jabatan>

  @belongsTo(() => UnitKerja)
  declare unitKerja: BelongsTo<typeof UnitKerja>

  @hasMany(() => Absensi)
  declare absensi: HasMany<typeof Absensi>

  @hasMany(() => Cuti)
  declare cuti: HasMany<typeof Cuti>

  @computed()
  get gajiTotal() {
    const pokok = Number(this.gajiPokok) || 0
    const tunjangan = Number(this.jabatan?.tunjangan) || 0
    return pokok + tunjangan
  }
}
