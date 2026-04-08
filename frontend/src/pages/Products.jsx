import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState('');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search)   params.search   = search;
    if (sort)     params.sort     = sort;
    api.get('/products', { params })
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search)   params.search   = search;
    api.get('/products', { params })
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false));
  };

  const setCategory = (c) => {
    const p = new URLSearchParams(searchParams);
    if (c) p.set('category', c); else p.delete('category');
    setSearchParams(p);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f7d6d0 0%, #faf5f3 40%, #e8cfc0 100%)',
        padding: '80px 0 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(42px, 6vw, 64px)',
            color: '#3d2b27',
            marginBottom: '16px',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            {category ? `${category} Collection` : '✨ All Collections'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#9e7b74',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>
            {products.length} shades of pure luxury
          </p>
          <p style={{
            fontSize: '13px',
            color: '#b89999',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            💚 Cruelty-free · 🌱 100% Vegan · ✨ Premium Quality
          </p>
        </div>
      </section>

      <div style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '48px',
            padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 248, 0.95) 100%)',
            border: '1.5px solid rgba(236, 221, 216, 0.6)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(61, 43, 39, 0.08)'
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['', 'Gel', 'Matte', 'Glossy'].map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: '10px 22px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1.5px solid',
                  borderColor: category === c ? '#d4538a' : '#ecddd8',
                  background: category === c ? '#d4538a' : 'rgba(255, 255, 255, 0.6)',
                  color: category === c ? '#fff' : '#9e7b74',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  fontWeight: 700,
                  boxShadow: category === c ? '0 6px 16px rgba(212, 83, 138, 0.25)' : 'none'
                }}
                  onMouseEnter={e => {
                    if (category !== c) {
                      e.currentTarget.style.borderColor = '#d4538a';
                      e.currentTarget.style.color = '#d4538a';
                    }
                  }}
                  onMouseLeave={e => {
                    if (category !== c) {
                      e.currentTarget.style.borderColor = '#ecddd8';
                      e.currentTarget.style.color = '#9e7b74';
                    }
                  }}
                >
                  {c || 'All'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Search shades..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '11px 16px',
                    border: '1.5px solid #ecddd8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#3d2b27',
                    outline: 'none',
                    width: '180px',
                    transition: 'all 0.3s ease',
                    background: '#fff'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#d4538a';
                    e.target.style.boxShadow = '0 0 12px rgba(212, 83, 138, 0.2)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#ecddd8';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '11px 20px', fontSize: '12px' }}>
                  Search
                </button>
              </form>

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '11px 16px',
                  border: '1.5px solid #ecddd8',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#3d2b27',
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: 600
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#d4538a';
                  e.target.style.boxShadow = '0 0 12px rgba(212, 83, 138, 0.2)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#ecddd8';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Latest</option>
                <option value="price_asc">Price: Low–High</option>
                <option value="price_desc">Price: High–Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#c9a96e', fontSize: '18px' }}>
              <p style={{ fontSize: '20px', marginBottom: '12px' }}>✨ Loading collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#9e7b74' }}>
              <p style={{ fontSize: '20px', marginBottom: '12px' }}>No products found</p>
              <p style={{ fontSize: '14px' }}>Try a different filter or search term</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              justifyContent: 'center',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              paddingBottom: '60px',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}