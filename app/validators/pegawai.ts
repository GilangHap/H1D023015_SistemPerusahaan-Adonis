// app/validators/pegawai.ts
import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new pegawai.
 */
export const createPegawaiValidator = vine.compile(
  vine.object({
    nip: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(20)
      .regex(/^[a-zA-Z0-9]+$/)
      .unique(async (db, value) => {
        const pegawai = await db.from('pegawais').where('nip', value).first()
        return !pegawai
      }),

    password: vine.string().minLength(6).maxLength(100),

    nama: vine.string().trim().minLength(2).maxLength(100),

    jabatanId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const jabatan = await db.from('jabatans').where('id', value).first()
        return !!jabatan
      }),

    unitKerjaId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const unitKerja = await db.from('unit_kerjas').where('id', value).first()
        return !!unitKerja
      }),

    gajiPokok: vine
      .number()
      .positive()
      .min(1000000) // Minimum 1 juta
      .max(999999999), // Maximum 999 juta

    email: vine.string().email().normalizeEmail().optional(),

    noTelp: vine
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]+$/)
      .minLength(10)
      .maxLength(15)
      .optional(),

    alamat: vine.string().trim().maxLength(500).optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing pegawai.
 */
export const updatePegawaiValidator = vine.compile(
  vine.object({
    nip: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(20)
      .regex(/^[a-zA-Z0-9]+$/),

    password: vine.string().minLength(6).maxLength(100).optional(),

    nama: vine.string().trim().minLength(2).maxLength(100),

    jabatanId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const jabatan = await db.from('jabatans').where('id', value).first()
        return !!jabatan
      }),

    unitKerjaId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const unitKerja = await db.from('unit_kerjas').where('id', value).first()
        return !!unitKerja
      }),

    gajiPokok: vine.number().positive().min(1000000).max(999999999),

    email: vine.string().email().normalizeEmail().optional(),

    noTelp: vine
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]+$/)
      .minLength(10)
      .maxLength(15)
      .optional(),

    alamat: vine.string().trim().maxLength(500).optional(),
  })
)
