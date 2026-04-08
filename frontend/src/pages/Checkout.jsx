import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleProceedToPayment = () => {
    if (!form.name || !form.address || !form.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Proceed to payment page with checkout data
    navigate('/payment', { state: { checkoutData: form } });
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1px solid #ecddd8', borderRadius: '2px',
    fontSize: '14px', color: '#3d2b27', outline: 'none',
    background: '#fffaf8'
  };

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', color: '#3d2b27', marginBottom: '40px' }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Shipping */}
            <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Shipping Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input style={inputStyle} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                <input style={inputStyle} name="address" placeholder="Street Address" value={form.address} onChange={handleChange} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input style={inputStyle} name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                  <input style={inputStyle} name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ background: '#fdf0f0', border: '1px solid #f5b8b8', borderRadius: '4px', padding: '20px' }}>
              <p style={{ fontSize: '14px', color: '#8b5e52', margin: 0 }}>
                ℹ️ You'll select your payment method on the next page (Card, UPI, or Razorpay)
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Your Order</h3>
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
              onClick={handleProceedToPayment} 
              disabled={cart.length === 0}
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', opacity: cart.length === 0 ? 0.7 : 1 }}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}