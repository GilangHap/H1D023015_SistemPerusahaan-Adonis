import Pegawai from '#models/pegawai'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PegawaiSeeder extends BaseSeeder {
  async run() {
    await Pegawai.create({
      nip: '12345678',
      nama: 'Admin Pegawai',
      password: await Pegawai.hashPassword('password123'),
      jabatanId: 1, // kolom: jabatan_id
      unitKerjaId: 1, // kolom: unit_kerja_id
      gajiPokok: 5000000, // kolom: gaji_pokok
      email: 'admin@pegawai.com',
      noTelp: '08123456789', // kolom: no_telp
      alamat: 'Jl. Contoh No. 1',
      fotoProfil: null, // kolom: foto_profil
      rememberToken: null, // kolom: remember_token
    })
  }
}
