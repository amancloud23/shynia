const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const auth   = require('../middleware/auth');
const admin  = require('../middleware/admin');

router.post('/',          auth,       ctrl.createOrder);
router.get('/my',         auth,       ctrl.myOrders);
router.get('/all',        auth, admin, ctrl.allOrders);
router.put('/:id/status', auth, admin, ctrl.updateStatus);

module.exports = router;