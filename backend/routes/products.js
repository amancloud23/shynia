const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const ctrl   = require('../controllers/productController');
const auth   = require('../middleware/auth');
const admin  = require('../middleware/admin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', upload.single('image'), auth, admin, ctrl.create);
router.put('/:id', upload.single('image'), auth, admin, ctrl.update);
router.delete('/:id', auth, admin, ctrl.remove);

module.exports = router;