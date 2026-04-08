const router = require('express').Router();
const auth = require('../middleware/auth');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');

// Create Razorpay order
router.post('/razorpay/create-order', auth, createPaymentOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', auth, verifyPayment);

module.exports = router;
