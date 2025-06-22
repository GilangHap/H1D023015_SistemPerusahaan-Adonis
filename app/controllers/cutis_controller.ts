import type { HttpContext } from '@adonisjs/core/http'
import Cuti from '../models/cuti.js'
import Pegawai from '../models/pegawai.js'

export default class CutisController {
  // List semua cuti
  async index({ view }: HttpContext) {
    const cutis = await Cuti.query().preload('pegawai').orderBy('createdAt', 'desc')
    return view.render('cuti/index', { cutis })
  }

  // Tampilkan form create cuti
  async create({ view }: HttpContext) {
    const pegawais = await Pegawai.all()
    return view.render('cuti/create', { pegawais })
  }

  // Simpan cuti baru
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only([
        'pegawai_id',
        'tanggal_mulai',
        'tanggal_akhir',
        'jumlah_hari',
        'alasan',
      ])

      // Hitung total cuti (pending & approved) tahun ini
      const tahunIni = new Date(data.tanggal_mulai).getFullYear()
      const totalCuti = await Cuti.query()
        .where('pegawai_id', data.pegawai_id)
        .whereRaw('YEAR(tanggal_mulai) = ?', [tahunIni])
        .whereIn('status', ['pending', 'approved'])
        .sum('jumlah_hari as total')

      const sudahDiambil = Number(totalCuti[0]?.$extras?.total ?? 0)
      const sisa = 12 - sudahDiambil

      if (Number(data.jumlah_hari) > sisa) {
        session.flash('error', `Sisa cuti tahun ini hanya ${sisa} hari`)
        return response.redirect().back()
      }

      await Cuti.create({
        ...data,
        status: 'pending',
      })
      session.flash('success', 'Pengajuan cuti berhasil dikirim')
    } catch (error) {
      session.flash('error', 'Gagal mengajukan cuti')
    }
    return response.redirect().toRoute('cuti.index')
  }

  // Detail cuti
  async show({ params, view, response, session }: HttpContext) {
    try {
      const cuti = await Cuti.query().where('id', params.id).preload('pegawai').firstOrFail()
      return view.render('cuti/show', { cuti })
    } catch (error) {
      session.flash('error', 'Data cuti tidak ditemukan')
      return response.redirect().toRoute('cuti.index')
    }
  }

  // Halaman verifikasi cuti (untuk admin)
  async verifikasi({ view }: HttpContext) {
    const cutis = await Cuti.query()
      .where('status', 'pending')
      .preload('pegawai')
      .orderBy('createdAt', 'desc')
    return view.render('cuti/verifikasi', { cutis })
  }

  // Proses verifikasi cuti (approve/reject)
  async prosesVerifikasi({ request, response, session }: HttpContext) {
    const { id, status, catatan } = request.only(['id', 'status', 'catatan']) // status: 'approved' atau 'rejected'
    const cuti = await Cuti.findOrFail(id)
    cuti.status = status
    cuti.catatan = catatan ?? null
    cuti.approved_by = session.get('pegawai_id') ?? null // ambil dari session, bukan auth.user
    await cuti.save()
    session.flash('success', `Cuti berhasil di${status === 'approved' ? 'setujui' : 'tolak'}`)
    return response.redirect().toRoute('cuti.verifikasi')
  }
}
