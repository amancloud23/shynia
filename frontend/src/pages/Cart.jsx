import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛍️</div>
      <h2 style={{ fontSize: '28px', color: '#3d2b27', marginBottom: '12px' }}>Your cart is empty</h2>
      <p style={{ color: '#9e7b74', marginBottom: '32px' }}>Discover our luxurious nail polish collection</p>
      <Link to="/products" className="btn-primary" style={{ padding: '14px 36px' }}>Shop Now</Link>
    </div>
  );

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', color: '#3d2b27', marginBottom: '40px' }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                background: '#fff',
                border: '1px solid #ecddd8',
                borderRadius: '4px',
                padding: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, #f7d6d0, #e8cfc0)',
                  borderRadius: '4px',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    : <div style={{ width: '24px', height: '54px', background: '#c9a96e', borderRadius: '12px 12px 4px 4px' }} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', color: '#3d2b27', marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ fontSize: '13px', color: '#9e7b74', marginBottom: '12px' }}>{item.category}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ecddd8', borderRadius: '2px' }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>−</button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '14px' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: 'none', border: 'none', color: '#9e7b74',
                      fontSize: '12px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase'
                    }}>
                      Remove
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '18px', color: '#3d2b27', fontFamily: 'Cormorant Garamond, serif', flexShrink: 0 }}>
                  ${(parseFloat(item.price) * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: '#fff',
            border: '1px solid #ecddd8',
            borderRadius: '4px',
            padding: '28px',
            position: 'sticky',
            top: '90px'
          }}>
            <h3 style={{ fontSize: '22px', color: '#3d2b27', marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#9e7b74' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#9e7b74' }}>
              <span>Shipping</span>
              <span style={{ color: '#3d7a3d' }}>{total >= 50 ? 'Free' : '$5.00'}</span>
            </div>
            <div style={{ borderTop: '1px solid #ecddd8', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#3d2b27', fontWeight: 500 }}>
                <span>Total</span>
                <span>${(total + (total >= 50 ? 0 : 5)).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => isLoggedIn ? navigate('/checkout') : navigate('/login')}
              className="btn-primary" style={{ width: '100%', padding: '14px', marginBottom: '12px' }}>
              {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
            <Link to="/products" style={{
              display: 'block', textAlign: 'center', fontSize: '13px',
              color: '#9e7b74', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}