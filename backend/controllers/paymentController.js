const Razorpay = require('razorpay');
const crypto = require('crypto');

// Check if Razorpay credentials are set properly
const hasValidCredentials = process.env.RAZORPAY_KEY_ID && 
                           process.env.RAZORPAY_KEY_SECRET &&
                           !process.env.RAZORPAY_KEY_ID.includes('your_key');

const razorpay = hasValidCredentials ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, orderItems } = req.body;

    if (!amount || !orderItems) {
      return res.status(400).json({ message: 'Amount and order items required' });
    }

    // If Razorpay credentials are not configured, use mock mode
    if (!hasValidCredentials) {
      return res.json({
        success: true,
        order_id: `mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        key_id: 'test_mode',
        mock: true
      });
    }

    // Create Razorpay order (amount in paise, so multiply by 100)
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user.id,
        items: orderItems.length
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      mock: false
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment order', error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // If order ID starts with 'mock_', skip Razorpay verification
    if (razorpay_order_id.includes('mock_')) {
      return res.json({
        success: true,
        message: 'Test payment verified successfully',
        payment_id: razorpay_payment_id || 'test_payment',
        order_id: razorpay_order_id
      });
    }

    // Create signature to verify payment
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification error', error: err.message });
  }
};
