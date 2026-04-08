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
      background: 'rgba(255, 250, 248, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(236, 221, 216, 0.6)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(61, 43, 39, 0.1)',
      WebkitBackdropFilter: 'blur(12px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '75px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '28px',
          letterSpacing: '0.3em',
          background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'transform 0.3s ease, filter 0.3s ease',
          filter: 'drop-shadow(0 2px 4px rgba(212, 83, 138, 0.2))'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(212, 83, 138, 0.3))';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(212, 83, 138, 0.2))';
          }}
        >
          ✦ SHYNIA
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Gel', path: '/products?category=Gel' },
            { label: 'Matte', path: '/products?category=Matte' },
            { label: 'Glossy', path: '/products?category=Glossy' },
            { label: 'About', path: '/about' }
          ].map(link => (
            <Link key={link.path} to={link.path} style={{
              fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', 
              color: '#3d2b27', fontWeight: 700, position: 'relative',
              transition: 'color 0.3s ease',
              paddingBottom: '4px',
              borderBottom: '2px solid transparent',
              borderBottomColor: 'rgba(212, 83, 138, 0)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#d4538a';
                e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#3d2b27';
                e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0)';
              }}
            >
              {link.label}
            </Link>
          ))}
          
          {isAdmin && (
            <Link to="/admin" style={{
              fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
              color: '#fff', padding: '8px 16px', borderRadius: '8px',
              fontWeight: 700, transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(212, 83, 138, 0.2)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 83, 138, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 83, 138, 0.2)';
              }}
            >
              Admin
            </Link>
          )}
          
          {user ? (
            <>
              <Link to="/orders" style={{
                fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#3d2b27', fontWeight: 700,
                transition: 'color 0.3s ease',
                paddingBottom: '4px',
                borderBottom: '2px solid transparent',
                borderBottomColor: 'rgba(212, 83, 138, 0)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d4538a';
                  e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#3d2b27';
                  e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0)';
                }}
              >
                Orders
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', fontSize: '13px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9e7b74',
                cursor: 'pointer', fontWeight: 700,
                transition: 'color 0.3s ease',
                paddingBottom: '4px',
                borderBottom: '2px solid transparent',
                borderBottomColor: 'rgba(212, 83, 138, 0)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d4538a';
                  e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#9e7b74';
                  e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{
              fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#3d2b27', fontWeight: 700,
              transition: 'color 0.3s ease',
              paddingBottom: '4px',
              borderBottom: '2px solid transparent',
              borderBottomColor: 'rgba(212, 83, 138, 0)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#d4538a';
                e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#3d2b27';
                e.currentTarget.style.borderBottomColor = 'rgba(212, 83, 138, 0)';
              }}
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" style={{
            position: 'relative',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="24" height="24" fill="none" stroke="#3d2b27" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '-12px', right: '-12px',
                background: 'linear-gradient(135deg, #d4538a 0%, #f39c12 100%)',
                color: '#fff',
                borderRadius: '50%', width: '26px', height: '26px',
                fontSize: '11px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800,
                boxShadow: '0 6px 16px rgba(212, 83, 138, 0.35)',
                border: '2px solid rgba(255, 255, 255, 0.8)'
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