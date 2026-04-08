import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function Payment() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state?.checkoutData || {};

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUpiId, setAdminUpiId] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch admin's UPI ID
    api.get('/auth/admin/settings')
      .then(res => setAdminUpiId(res.data.upi_id || ''))
      .catch(() => setAdminUpiId(''))
      .finally(() => setLoadingSettings(false));
  }, []);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.id, quantity: i.qty }));

      // Create Razorpay order on backend
      const orderRes = await api.post('/payments/razorpay/create-order', {
        amount: total,
        orderItems: items
      });

      // If mock mode, simulate payment success
      if (orderRes.data.mock) {
        try {
          // Simulate payment verification
          const verifyRes = await api.post('/payments/razorpay/verify', {
            razorpay_order_id: orderRes.data.order_id,
            razorpay_payment_id: `mock_${Date.now()}`,
            razorpay_signature: 'mock_signature'
          });

          if (verifyRes.data.success) {
            // Payment verified - now create the order
            const createRes = await api.post('/orders', {
              items,
              payment_method: 'razorpay',
              razorpay_payment_id: verifyRes.data.payment_id,
              razorpay_order_id: orderRes.data.order_id
            });

            clearCart();
            toast.success(`✅ Test Payment successful! Order #${createRes.data.order_id} placed.`);
            navigate('/orders');
          }
        } catch (err) {
          toast.error('Test payment verification failed: ' + (err.response?.data?.message || err.message));
        }
        setLoading(false);
        return;
      }

      const options = {
        key: orderRes.data.key_id,
        amount: orderRes.data.amount,
        currency: 'INR',
        name: 'SHYNIA',
        description: 'Nail Polish Purchase',
        image: 'https://via.placeholder.com/100', // Add your logo
        order_id: orderRes.data.order_id,
        
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              // Payment verified - now create the order
              const createRes = await api.post('/orders', {
                items,
                payment_method: 'razorpay',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id
              });

              clearCart();
              toast.success(`✅ Payment successful! Order #${createRes.data.order_id} placed.`);
              navigate('/orders');
            }
          } catch (err) {
            toast.error('Payment verification failed: ' + (err.response?.data?.message || err.message));
          }
        },
        
        prefill: {
          name: checkoutData.name || '',
          email: '',
          contact: ''
        },
        
        notes: {
          address: checkoutData.address || '',
          city: checkoutData.city || ''
        },
        
        theme: {
          color: '#c9a96e'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      
      rzp.open();
      setLoading(false);
    } catch (err) {
      toast.error('Error creating payment: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.id, quantity: i.qty }));
      const payload = {
        items,
        payment_method: 'upi',
        upi_id: upiId
      };

      const res = await api.post('/orders', payload);
      clearCart();
      
      toast.success(`📱 Payment via UPI initiated! Order #${res.data.order_id} created.`);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (paymentMethod === 'upi') {
      await handleUPIPayment();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ecddd8',
    borderRadius: '2px',
    fontSize: '14px',
    color: '#3d2b27',
    outline: 'none',
    background: '#fffaf8'
  };

  const methodCard = (method, icon, title, description) => (
    <div
      onClick={() => setPaymentMethod(method)}
      style={{
        padding: '20px',
        border: paymentMethod === method ? '2px solid #c9a96e' : '1px solid #ecddd8',
        borderRadius: '4px',
        cursor: 'pointer',
        background: paymentMethod === method ? '#fffaf8' : '#fff',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <input
          type="radio"
          name="payment"
          value={method}
          checked={paymentMethod === method}
          onChange={e => setPaymentMethod(e.target.value)}
          style={{ cursor: 'pointer' }}
        />
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <h4 style={{ margin: 0, color: '#3d2b27', fontSize: '16px', fontWeight: 500 }}>
          {title}
        </h4>
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: '#9e7b74' }}>
        {description}
      </p>
    </div>
  );

  return (
    <div style={{ padding: '60px 0', minHeight: '70vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', color: '#3d2b27', marginBottom: '40px' }}>Payment</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>
          {/* Payment Methods */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>
              Choose Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {methodCard('razorpay', '🏦', 'Razorpay (Recommended)', 'Real-time UPI + All payment methods')}
              {methodCard('upi', '📱', 'Direct UPI Transfer', 'Manual UPI payment to merchant account')}
            </div>

            {/* UPI Input */}
            {paymentMethod === 'upi' && (
              <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', marginBottom: '28px' }}>
                <h4 style={{ marginBottom: '16px', color: '#3d2b27' }}>UPI Payment Details</h4>
                
                {/* Receive to Account */}
                {!loadingSettings && adminUpiId && (
                  <div style={{ padding: '16px', background: '#e6fff0', border: '1px solid #a8d5a2', borderRadius: '4px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', color: '#1a7a40', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0', fontWeight: 500 }}>
                      💚 Payment will be sent to
                    </p>
                    <p style={{ fontSize: '16px', color: '#1a7a40', fontWeight: 600, margin: 0 }}>
                      {adminUpiId}
                    </p>
                  </div>
                )}

                {!loadingSettings && !adminUpiId && (
                  <div style={{ padding: '16px', background: '#fff8e6', border: '1px solid #f5d58e', borderRadius: '4px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#b07800', margin: 0 }}>
                      ⚠️ Admin UPI ID not configured yet. Contact support.
                    </p>
                  </div>
                )}

                {/* Customer UPI ID Input */}
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5e52', marginBottom: '6px' }}>
                  Your UPI ID (to complete payment from)
                </label>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., user@okhdfcbank)"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize: '12px', color: '#9e7b74', marginTop: '12px', margin: '0' }}>
                  🔒 Your UPI ID is secure and encrypted. Payment will transfer from your account to the merchant account.
                </p>
              </div>
            )}

            {/* Card Input (kept for demo) */}
            {paymentMethod === 'card' && (
              <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', marginBottom: '28px' }}>
                <h4 style={{ marginBottom: '16px', color: '#3d2b27' }}>Card Details</h4>
                <p style={{ fontSize: '12px', color: '#9e7b74', marginBottom: '16px' }}>
                  🔒 Demo mode — use test card: 4242 4242 4242 4242
                </p>
                <input
                  type="text"
                  placeholder="Card Number"
                  style={{ ...inputStyle, marginBottom: '14px' }}
                  maxLength={19}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    style={inputStyle}
                    maxLength={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#8b5e52' }}>{item.name} × {item.qty}</span>
                  <span style={{ color: '#3d2b27' }}>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #ecddd8', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#3d2b27', fontWeight: 500 }}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || cart.length === 0}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                opacity: loading || cart.length === 0 ? 0.7 : 1,
                cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
            </button>

            <p style={{ fontSize: '11px', color: '#9e7b74', textAlign: 'center', marginTop: '16px' }}>
              {paymentMethod === 'razorpay' ? '🏦 Secure Razorpay checkout' : paymentMethod === 'upi' ? '📱 UPI transfer is instant' : '💳 Card payment is secure'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
