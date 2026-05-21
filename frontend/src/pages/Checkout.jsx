import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', cardNumber: '', expiry: '', cvv: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleOrder = async () => {
    if (!form.name || !form.address || !form.city || !form.cardNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.id, quantity: i.qty }));
      const res = await api.post('/orders', { items });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
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
                <input style={inputStyle} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
                <input style={inputStyle} name="address" placeholder="Street Address" value={form.address} onChange={handleChange} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input style={inputStyle} name="city" placeholder="City" value={form.city} onChange={handleChange} />
                  <input style={inputStyle} name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Payment Details</h3>
              <p style={{ fontSize: '12px', color: '#9e7b74', marginBottom: '16px', letterSpacing: '0.05em' }}>
                🔒 Demo mode — no real payment processed
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input style={inputStyle} name="cardNumber" placeholder="Card Number (e.g. 4242 4242 4242 4242)" value={form.cardNumber} onChange={handleChange} maxLength={19} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input style={inputStyle} name="expiry" placeholder="MM / YY" value={form.expiry} onChange={handleChange} />
                  <input style={inputStyle} name="cvv" placeholder="CVV" value={form.cvv} onChange={handleChange} maxLength={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Your Order</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#8b5e52' }}>{item.name} × {item.qty}</span>
                  <span style={{ color: '#3d2b27' }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #ecddd8', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#3d2b27', fontWeight: 500 }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={loading || cart.length === 0} className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}