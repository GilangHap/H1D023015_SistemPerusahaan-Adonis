import type { HttpContext } from '@adonisjs/core/http'
import Absensi from '../models/absensi.js'
import Pegawai from '../models/pegawai.js'
import { DateTime } from 'luxon'

export default class AbsensisController {
  // Tabel semua pegawai + status absen hari ini
  async index({ view }: HttpContext) {
    const today = DateTime.local().toISODate()
    const pegawais = await Pegawai.all()

    // Ambil semua absensi hari ini
    const absensiToday = await Absensi.query().where('tanggal', today)
    // Buat map: pegawaiId => absensi
    const absensiMap = Object.fromEntries(absensiToday.map((a) => [a.pegawai_id, a]))

    return view.render('absen/index', { pegawais, absensiMap, today })
  }

  // Proses absen masuk/pulang untuk pegawai tertentu
  async store({ request, response, session }: HttpContext) {
    const pegawaiId = request.input('pegawai_id')
    const tipe = request.input('tipe') // 'masuk' atau 'pulang'
    const today = DateTime.local().toISODate()

    // Cari absensi hari ini
    let absensi = await Absensi.query()
      .where('pegawai_id', pegawaiId)
      .where('tanggal', today)
      .first()

    if (tipe === 'masuk') {
      if (absensi) {
        session.flash('error', 'Pegawai sudah absen masuk hari ini.')
        return response.redirect().back()
      }
      await Absensi.create({
        pegawai_id: pegawaiId,
        tanggal: DateTime.local(),
        jam_masuk: DateTime.local().toFormat('HH:mm:ss'),
        status: 'hadir',
        keterangan: null,
      })
      session.flash('success', 'Absen masuk berhasil!')
    } else if (tipe === 'pulang') {
      if (!absensi) {
        session.flash('error', 'Pegawai belum absen masuk hari ini.')
        return response.redirect().back()
      }
      if (absensi.jam_pulang) {
        session.flash('error', 'Pegawai sudah absen pulang hari ini.')
        return response.redirect().back()
      }
      absensi.jam_pulang = DateTime.local().toFormat('HH:mm:ss')
      await absensi.save()
      session.flash('success', 'Absen pulang berhasil!')
    } else {
      session.flash('error', 'Tipe absen tidak valid.')
    }

    return response.redirect().back()
  }

  // Tambahkan pada AbsensisController
  async history({ request, view }: HttpContext) {
    // Ambil filter tanggal dari query string, misal ?tanggal=2025-06-22
    const tanggal = request.input('tanggal')
    let absensisQuery = Absensi.query().preload('pegawai').orderBy('tanggal', 'desc')

    if (tanggal) {
      absensisQuery = absensisQuery.where('tanggal', tanggal)
    }

    const absensis = await absensisQuery

    return view.render('absen/history', { absensis, tanggal })
  }
}
