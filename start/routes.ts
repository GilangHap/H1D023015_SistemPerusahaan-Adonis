const DashboardController = () => import('#controllers/dashboard_controller')
const AuthController = () => import('#controllers/auth_controller')
const PegawaisController = () => import('#controllers/pegawais_controller')
const JabatansController = () => import('#controllers/jabatans_controller')
const UnitKerjasController = () => import('#controllers/unit_kerjas_controller')
const AbsensisController = () => import('#controllers/absensis_controller')
const CutisController = () => import('#controllers/cutis_controller')
import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

// Redirect root ke login
router.get('/', ({ response }) => {
  return response.redirect('/login')
})
// router.get('/profile', [AuthController, 'showLogin']).as('profile')
router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'showRegister'])
router.post('/register', [AuthController, 'register'])
router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())

router
  .group(() => {
    // Auth routes
    router.get('/cuti/verifikasi', [CutisController, 'verifikasi']).as('cuti.verifikasi')
    router
      .post('/cuti/verifikasi', [CutisController, 'prosesVerifikasi'])
      .as('cuti.prosesVerifikasi')

    router.resource('pegawai', PegawaisController).as('pegawai')
    router.resource('jabatan', JabatansController).as('jabatan')
    router.resource('unit_kerja', UnitKerjasController).as('unit_kerja')
    router.resource('cuti', CutisController).as('cuti')

    router.get('/absensi', [AbsensisController, 'index']).as('absensi.index')
    router.post('/absensi/store', [AbsensisController, 'store']).as('absensi.store')
    router.get('/absensi/history', [AbsensisController, 'history']).as('absensi.history')

    // Dashboard route
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')
  })
  .use(middleware.auth())
