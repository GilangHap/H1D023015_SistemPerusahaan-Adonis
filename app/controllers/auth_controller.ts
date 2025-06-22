import Pegawai from '#models/pegawai'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ request, response, session, auth }: HttpContext) {
    const { nip, password } = request.only(['nip', 'password'])

    try {
      const pegawai = await Pegawai.findByOrFail('nip', nip)
      const isPasswordValid = await pegawai.verifyPassword(password)

      if (!isPasswordValid) {
        session.flash('error', 'NIP atau password salah')
        return response.redirect().back()
      }

      await auth.use('web').login(pegawai) // gunakan auth, bukan session manual
      session.flash('success', 'Login berhasil!')
      return response.redirect('/dashboard')
    } catch (error) {
      session.flash('error', 'NIP atau password salah')
      return response.redirect().back()
    }
  }

  async logout({ response, session }: HttpContext) {
    session.clear()
    session.flash('success', 'Logout berhasil!')
    return response.redirect('/login')
  }

  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async register({ request, response, session }: HttpContext) {
    const { nip, nama, password } = request.only(['nip', 'nama', 'password'])

    const jabatanId = 2
    const unitKerjaId = 3

    try {
      if (!nip || !nama || !password) {
        session.flash('error', 'Semua field wajib diisi')
        return response.redirect().back()
      }

      const existing = await Pegawai.findBy('nip', nip)
      if (existing) {
        session.flash('error', 'NIP sudah terdaftar')
        return response.redirect().back()
      }

      await Pegawai.create({
        nip,
        nama,
        password,
        jabatanId,
        unitKerjaId,
        gajiPokok: 0,
        email: null,
        noTelp: null,
        alamat: null,
        fotoProfil: null,
        rememberToken: null,
      })

      session.flash('success', 'Registrasi berhasil! Silakan login.')
      return response.redirect('/login')
    } catch (error) {
      session.flash('error', 'Registrasi gagal')
      return response.redirect().back()
    }
  }
}
