import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#3d2b27',
      color: '#e8cfc0',
      padding: '60px 0 30px'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', letterSpacing: '0.3em', marginBottom: '12px', color: '#c9a96e' }}>
            ✦ SHYNIA
          </h2>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#9e7b74' }}>
            Luxury nail polish crafted for the modern woman. Premium formulas, exquisite finishes.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', color: '#c9a96e' }}>Collection</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Gel', 'Matte', 'Glossy'].map(c => (
              <Link key={c} to={`/products?category=${c}`} style={{ fontSize: '13px', color: '#9e7b74', transition: 'color 0.2s' }}>
                {c} Collection
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', color: '#c9a96e' }}>Account</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders']].map(([l, h]) => (
              <Link key={l} to={h} style={{ fontSize: '13px', color: '#9e7b74' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', color: '#c9a96e' }}>Follow Us</h4>
          <p style={{ fontSize: '13px', color: '#9e7b74' }}>@shynia.nails</p>
          <p style={{ fontSize: '13px', color: '#9e7b74', marginTop: '6px' }}>Instagram · Pinterest · TikTok</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#9e7b74', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} SHYNIA. All rights reserved. Crafted with ♥
        </p>
      </div>
    </footer>
  );
}