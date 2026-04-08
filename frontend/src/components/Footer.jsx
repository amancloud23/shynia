import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2d2520 0%, #3d2b27 50%, #4a3634 100%)',
      color: '#e8cfc0',
      padding: '80px 0 32px'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '56px',
        marginBottom: '56px'
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '26px',
            letterSpacing: '0.3em',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 600
          }}>
            ✦ SHYNIA
          </h2>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#b89999',
            letterSpacing: '0.03em'
          }}>
            Luxury nail polish crafted for the modern woman. Premium formulas, exquisite finishes, unforgettable beauty.
          </p>
        </div>

        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            color: '#d4538a',
            fontWeight: 700
          }}>
            Collection
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Gel', 'Matte', 'Glossy'].map(c => (
              <Link key={c} to={`/products?category=${c}`} style={{
                fontSize: '14px',
                color: '#b89999',
                transition: 'all 0.3s ease',
                letterSpacing: '0.02em'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d4538a';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#b89999';
                  e.currentTarget.style.paddingLeft = '0px';
                }}
              >
                {c} Collection
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            color: '#d4538a',
            fontWeight: 700
          }}>
            Account
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders']].map(([l, h]) => (
              <Link key={l} to={h} style={{
                fontSize: '14px',
                color: '#b89999',
                transition: 'all 0.3s ease',
                letterSpacing: '0.02em'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d4538a';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#b89999';
                  e.currentTarget.style.paddingLeft = '0px';
                }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            color: '#d4538a',
            fontWeight: 700
          }}>
            Follow Us
          </h4>
          <p style={{
            fontSize: '14px',
            color: '#b89999',
            fontWeight: 600,
            letterSpacing: '0.03em'
          }}>
            @shynia.nails
          </p>
          <p style={{
            fontSize: '13px',
            color: '#999388',
            marginTop: '8px',
            letterSpacing: '0.05em'
          }}>
            Instagram · Pinterest · TikTok
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        paddingTop: '32px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div style={{ padding: '12px' }}>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>🐰</p>
            <p style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#d4538a',
              letterSpacing: '0.08em'
            }}>CRUELTY-FREE</p>
            <p style={{
              fontSize: '11px',
              color: '#b89999',
              marginTop: '4px'
            }}>Not tested on animals</p>
          </div>
          <div style={{ padding: '12px' }}>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>🌱</p>
            <p style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#6ab04c',
              letterSpacing: '0.08em'
            }}>100% VEGAN</p>
            <p style={{
              fontSize: '11px',
              color: '#b89999',
              marginTop: '4px'
            }}>Free from animal products</p>
          </div>
          <div style={{ padding: '12px' }}>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>✨</p>
            <p style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#c9a96e',
              letterSpacing: '0.08em'
            }}>PREMIUM QUALITY</p>
            <p style={{
              fontSize: '11px',
              color: '#b89999',
              marginTop: '4px'
            }}>FDA-approved formula</p>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        paddingTop: '32px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#999388',
          letterSpacing: '0.05em'
        }}>
          © {new Date().getFullYear()} SHYNIA. All rights reserved. Crafted with <span style={{ color: '#d4538a' }}>♥</span>
        </p>
      </div>
    </footer>
  );
}