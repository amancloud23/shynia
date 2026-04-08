const router = require('express').Router();
const { register, login, registerValidation, promoteToAdmin, getAdminSettings, updateAdminSettings } = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/promote-admin', promoteToAdmin);

// Admin settings
router.get('/admin/settings', auth, admin, getAdminSettings);
router.put('/admin/settings', auth, admin, updateAdminSettings);

module.exports = router;