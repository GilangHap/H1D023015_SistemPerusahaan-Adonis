import type { HttpContext } from '@adonisjs/core/http'
import UnitKerja from '../models/unit_kerja.js'

export default class UnitKerjasController {
  // List all unit kerja
  async index({ view }: HttpContext) {
    const unitKerjas = await UnitKerja.all()
    return view.render('unit_kerja/index', { unitKerjas })
  }

  // Show create form
  async create({ view }: HttpContext) {
    return view.render('unit_kerja/create')
  }

  // Store new unit kerja
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['namaUnit', 'lokasi'])
      await UnitKerja.create(data)
      session.flash('success', 'Unit Kerja berhasil ditambahkan')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan Unit Kerja')
    }
    return response.redirect().toRoute('unit_kerja.index')
  }

  // Show detail
  async show({ params, view }: HttpContext) {
    const unitKerja = await UnitKerja.findOrFail(params.id)
    return view.render('unit_kerja/show', { unitKerja })
  }

  // Show edit form
  async edit({ params, view }: HttpContext) {
    const unitKerja = await UnitKerja.findOrFail(params.id)
    return view.render('unit_kerja/edit', { unitKerja })
  }

  // Update unit kerja
  async update({ params, request, response, session }: HttpContext) {
    try {
      const unitKerja = await UnitKerja.findOrFail(params.id)
      const data = request.only(['namaUnit', 'lokasi'])
      unitKerja.merge(data)
      await unitKerja.save()
      session.flash('success', 'Unit Kerja berhasil diupdate')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui Unit Kerja')
    }
    return response.redirect().toRoute('unit_kerja.index')
  }

  // Delete unit kerja
  async destroy({ params, response, session }: HttpContext) {
    try {
      const unitKerja = await UnitKerja.findOrFail(params.id)
      await unitKerja.delete()
      session.flash('success', 'Unit Kerja berhasil dihapus')
    } catch (error) {
      session.flash('error', 'Gagal menghapus Unit Kerja')
    }
    return response.redirect().toRoute('unit_kerja.index')
  }
}
