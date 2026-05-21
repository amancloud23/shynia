const router = require('express').Router();
const { register, login, registerValidation, promoteToAdmin } = require('../controllers/authController');

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/promote-admin', promoteToAdmin);

module.exports = router;