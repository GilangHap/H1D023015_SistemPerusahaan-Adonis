import Role from '#models/role'
import Jabatan from '#models/jabatan'
import UnitKerja from '#models/unit_kerja'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Seed roles
    const roles = await Role.createMany([
      { name: 'admin', description: 'Administrator' },
      { name: 'atasan', description: 'Atasan/Pimpinan' },
      { name: 'staff', description: 'Staff Pegawai' },
    ])

    // Seed jabatans (contoh, sesuaikan dengan kebutuhan Anda)
    await Jabatan.createMany([
      { namaJabatan: 'Manager', tunjangan: 2000000, roleId: roles[1].id }, // Atasan
      { namaJabatan: 'Staff HR', tunjangan: 1000000, roleId: roles[2].id }, // Staff
      { namaJabatan: 'Admin IT', tunjangan: 1500000, roleId: roles[0].id }, // Admin
    ])

    // Seed unit_kerjas (contoh, sesuaikan dengan kebutuhan Anda)
    await UnitKerja.createMany([
      { namaUnit: 'HRD', lokasi: 'Jakarta' },
      { namaUnit: 'IT Support', lokasi: 'Bandung' },
      { namaUnit: 'Keuangan', lokasi: 'Surabaya' },
    ])
  }
}
