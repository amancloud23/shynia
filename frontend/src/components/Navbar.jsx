import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#fffaf8',
      borderBottom: '1px solid #ecddd8',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '26px',
          letterSpacing: '0.25em',
          color: '#3d2b27',
          fontWeight: 300
        }}>
          ✦ SHYNIA
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/products" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3d2b27' }}>
            Collection
          </Link>
          {isAdmin && (
            <Link to="/admin" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e' }}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/orders" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3d2b27' }}>
                Orders
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', fontSize: '13px',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3d2b27' }}>
              Login
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative' }}>
            <svg width="22" height="22" fill="none" stroke="#3d2b27" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#c9a96e', color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '11px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 600
              }}>
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}