import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products').then(r => setFeatured(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f7d6d0 0%, #e8cfc0 60%, #f0e8e0 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '16px' }}>
              Premium Nail Polish
            </p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1.1,
              color: '#3d2b27',
              marginBottom: '24px',
              fontWeight: 300
            }}>
              Beauty at<br />Your Fingertips
            </h1>
            <p style={{ fontSize: '16px', color: '#8b5e52', lineHeight: 1.7, marginBottom: '36px', maxWidth: '400px' }}>
              Discover our curated collection of luxury nail polishes — from gel glossy finishes to velvety matte perfection.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-primary" style={{ padding: '14px 36px' }}>
                Shop Now
              </Link>
              <Link to="/products?category=Gel" className="btn-outline" style={{ padding: '14px 36px' }}>
                Explore Gel
              </Link>
            </div>
          </div>

          {/* Decorative polish bottles */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'flex-end' }}>
            {[
              { h: 160, color: '#d4a5c9', delay: '0s' },
              { h: 200, color: '#c9a96e', delay: '0.1s' },
              { h: 140, color: '#f7a8b0', delay: '0.2s' },
              { h: 180, color: '#a8c5c9', delay: '0.3s' }
            ].map((b, i) => (
              <div key={i} style={{
                width: '48px',
                height: b.h,
                background: `linear-gradient(180deg, ${b.color} 0%, ${b.color}cc 100%)`,
                borderRadius: '24px 24px 6px 6px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                animation: `float 3s ease-in-out infinite`,
                animationDelay: b.delay
              }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0', background: '#fffaf8' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '8px', color: '#3d2b27' }}>
            Shop by Finish
          </h2>
          <p style={{ textAlign: 'center', color: '#9e7b74', marginBottom: '48px' }}>
            Find your perfect formula
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Gel', desc: 'Long-lasting, mirror shine', color: '#f7d6d0', icon: '💅' },
              { name: 'Matte', desc: 'Velvety, sophisticated finish', color: '#e8cfc0', icon: '🖤' },
              { name: 'Glossy', desc: 'Vibrant, high-shine colour', color: '#f0e0e8', icon: '✨' }
            ].map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}>
                <div style={{
                  background: cat.color,
                  borderRadius: '4px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(61,43,39,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{cat.icon}</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px', color: '#3d2b27' }}>{cat.name}</h3>
                  <p style={{ fontSize: '14px', color: '#8b5e52' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: '80px 0', background: '#fff5f2' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '8px', color: '#3d2b27' }}>
              Featured Collection
            </h2>
            <p style={{ textAlign: 'center', color: '#9e7b74', marginBottom: '48px' }}>
              Hand-picked by our beauty experts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link to="/products" className="btn-outline" style={{ padding: '14px 48px' }}>
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section style={{ padding: '80px 0', background: '#fffaf8' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '48px', color: '#3d2b27' }}>
            What Our Clients Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Sophia R.', review: 'The Gel collection is absolutely stunning. Long-lasting and the colours are exactly as shown. A truly premium experience!', stars: 5 },
              { name: 'Aisha M.', review: 'SHYNIA has become my go-to brand. The packaging is gorgeous and the matte finishes are unmatched in quality.', stars: 5 },
              { name: 'Priya K.', review: 'Finally a nail polish brand that delivers on its promises. The glossy range is my absolute favourite!', stars: 5 }
            ].map((r, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #ecddd8',
                borderRadius: '4px',
                padding: '32px',
                position: 'relative'
              }}>
                <div style={{ color: '#c9a96e', fontSize: '20px', marginBottom: '12px' }}>
                  {'★'.repeat(r.stars)}
                </div>
                <p style={{ fontSize: '14px', color: '#8b5e52', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                  "{r.review}"
                </p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#3d2b27', letterSpacing: '0.05em' }}>
                  — {r.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}