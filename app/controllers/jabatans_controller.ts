import type { HttpContext } from '@adonisjs/core/http'
import Jabatan from '../models/jabatan.js'
import Role from '../models/role.js'

export default class JabatansController {
  // List all jabatans
  async index({ view }: HttpContext) {
    const jabatans = await Jabatan.query().preload('role')
    const roles = await Role.all()
    return view.render('jabatan/index', { jabatans, roles })
  }

  // Show create form
  async create({ view }: HttpContext) {
    return view.render('jabatan/create')
  }

  // Store new jabatan
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['namaJabatan', 'tunjangan', 'roleId'])
      await Jabatan.create(data)
      session.flash('success', 'Jabatan berhasil ditambahkan')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan jabatan')
    }
    return response.redirect().toRoute('jabatan.index')
  }

  // Show detail
  async show({ params, view }: HttpContext) {
    const jabatan = await Jabatan.findOrFail(params.id)
    return view.render('jabatan/show', { jabatan })
  }

  // Show edit form
  async edit({ params, view }: HttpContext) {
    const jabatan = await Jabatan.findOrFail(params.id)
    const roles = await Role.all()
    return view.render('jabatan/edit', { jabatan, roles })
  }

  // Update jabatan
  async update({ params, request, response, session }: HttpContext) {
    try {
      const jabatan = await Jabatan.findOrFail(params.id)
      const data = request.only(['namaJabatan', 'tunjangan', 'roleId'])
      jabatan.merge(data)
      await jabatan.save()
      session.flash('success', 'Jabatan berhasil diupdate')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui jabatan')
    }
    return response.redirect().toRoute('jabatan.index')
  }

  // Delete jabatan
  async destroy({ params, response, session }: HttpContext) {
    try {
      const jabatan = await Jabatan.findOrFail(params.id)
      await jabatan.delete()
      session.flash('success', 'Jabatan berhasil dihapus')
    } catch (error) {
      session.flash('error', 'Gagal menghapus jabatan')
    }
    return response.redirect().toRoute('jabatan.index')
  }
}
