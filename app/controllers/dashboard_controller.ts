import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Pegawai from '../models/pegawai.js'
import Jabatan from '../models/jabatan.js'
import Departemen from '../models/unit_kerja.js'
import Cuti from '../models/cuti.js'
import Absensi from '../models/absensi.js'

export default class DashboardController {
  async index({ view }: HttpContext) {
    const pegawaiCount = await Pegawai.query().count('* as total').first()
    const departemenCount = await Departemen.query().count('* as total').first()
    const jabatanCount = await Jabatan.query().count('* as total').first()
    const cutiCount = await Cuti.query().count('* as total').first()
    const absensiCount = await Absensi.query().where('tanggal', today()).count('* as total').first()

    // Tambahan statistik
    const cutiPending = await Cuti.query().where('status', 'pending').count('* as total').first()
    const cutiApproved = await Cuti.query()
      .where('status', 'approved')
      .whereRaw('YEAR(tanggal_mulai) = ?', [DateTime.now().year])
      .count('* as total')
      .first()
    const pegawaiAbsenMasuk = await Absensi.query()
      .where('tanggal', today())
      .whereNotNull('jam_masuk')
      .countDistinct('pegawai_id as total')
      .first()

    return view.render('dashboard', {
      pegawaiCount: pegawaiCount?.$extras.total || 0,
      departemenCount: departemenCount?.$extras.total || 0,
      jabatanCount: jabatanCount?.$extras.total || 0,
      cutiCount: cutiCount?.$extras.total || 0,
      absensiCount: absensiCount?.$extras.total || 0,
      cutiPending: cutiPending?.$extras.total || 0,
      cutiApproved: cutiApproved?.$extras.total || 0,
      pegawaiAbsenMasuk: pegawaiAbsenMasuk?.$extras.total || 0,
    })
  }
}
function today(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
