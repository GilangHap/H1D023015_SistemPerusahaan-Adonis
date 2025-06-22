import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import Pegawai from '../models/pegawai.js'
import Jabatan from '../models/jabatan.js'
import UnitKerja from '../models/unit_kerja.js'

export default class PegawaisController {
  // List all employees
  async index({ view }: HttpContext) {
    const pegawais = await Pegawai.query().preload('jabatan').preload('unitKerja')
    return view.render('pegawai/index', { pegawais })
  }

  // Show create form
  async create({ view }: HttpContext) {
    const jabatans = await Jabatan.all()
    const unitKerjas = await UnitKerja.all()
    return view.render('pegawai/create', { jabatans, unitKerjas })
  }

  // Store new employee
  async store({ request, response, session }: HttpContext) {
    try {
      const data: {
        nip: any
        password: any
        nama: any
        jabatanId: any
        unitKerjaId: any
        gajiPokok: any
        email: any
        noTelp: any
        alamat: any
        fotoProfil?: string
      } = request.only([
        'nip',
        'password',
        'nama',
        'jabatanId',
        'unitKerjaId',
        'gajiPokok',
        'email',
        'noTelp',
        'alamat',
      ])

      // Handle file upload
      const foto = request.file('fotoProfil')
      if (foto) {
        const fileName = `${cuid()}.${foto.extname}`
        await foto.move('uploads/pegawai', { name: fileName, overwrite: true })
        data.fotoProfil = fileName
      }

      await Pegawai.create(data) // hashing otomatis oleh @beforeSave di model
      session.flash('success', 'Pegawai berhasil ditambahkan')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan pegawai')
    }

    return response.redirect().toRoute('pegawai.index')
  }

  // Show detail
  async show({ params, view }: HttpContext) {
    const pegawai = await Pegawai.query()
      .where('id', params.id)
      .preload('jabatan')
      .preload('unitKerja')
      .firstOrFail()

    return view.render('pegawai/show', { pegawai })
  }

  // Show edit form
  async edit({ params, view }: HttpContext) {
    const pegawai = await Pegawai.findOrFail(params.id)
    const jabatans = await Jabatan.all()
    const unitKerjas = await UnitKerja.all()

    return view.render('pegawai/edit', { pegawai, jabatans, unitKerjas })
  }

  // Update employee
  async update({ params, request, response, session }: HttpContext) {
    try {
      const pegawai = await Pegawai.findOrFail(params.id)

      const data = request.only([
        'nip',
        'nama',
        'jabatanId',
        'unitKerjaId',
        'gajiPokok',
        'email',
        'noTelp',
        'alamat',
      ]) as Record<string, any>

      // Handle password update
      const password = request.input('password')
      if (password) {
        data.password = password // akan di-hash otomatis oleh model
      }

      // Handle file upload (jika ada file baru)
      const foto = request.file('fotoProfil')
      if (foto) {
        const fileName = `${cuid()}.${foto.extname}`
        await foto.move('uploads/pegawai', { name: fileName, overwrite: true })
        data.fotoProfil = fileName
      }

      pegawai.merge(data)
      await pegawai.save()

      session.flash('success', 'Pegawai berhasil diupdate')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui pegawai')
    }

    return response.redirect().toRoute('pegawai.index')
  }

  // Delete employee
  async destroy({ params, response, session }: HttpContext) {
    try {
      const pegawai = await Pegawai.findOrFail(params.id)
      await pegawai.delete()
      session.flash('success', 'Pegawai berhasil dihapus')
    } catch (error) {
      session.flash('error', 'Gagal menghapus pegawai')
    }

    return response.redirect().toRoute('pegawai.index')
  }
}
