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
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', color: '#3d2b27', marginBottom: '8px' }}>
            {category ? `${category} Collection` : 'All Collections'}
          </h1>
          <p style={{ color: '#9e7b74' }}>
            {products.length} shades available
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '36px',
          padding: '20px 24px',
          background: '#fff',
          border: '1px solid #ecddd8',
          borderRadius: '4px'
        }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['', 'Gel', 'Matte', 'Glossy'].map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '7px 18px',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1.5px solid',
                borderColor: category === c ? '#3d2b27' : '#ecddd8',
                background: category === c ? '#3d2b27' : 'transparent',
                color: category === c ? '#fff' : '#9e7b74',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                {c || 'All'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search shades..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ecddd8',
                  borderRadius: '2px',
                  fontSize: '13px',
                  color: '#3d2b27',
                  outline: 'none',
                  width: '180px'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Search
              </button>
            </form>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ecddd8',
                borderRadius: '2px',
                fontSize: '13px',
                color: '#3d2b27',
                background: '#fff',
                cursor: 'pointer',
                outline: 'none'
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
          <div style={{ textAlign: 'center', padding: '80px', color: '#c9a96e', fontSize: '18px' }}>
            Loading collection...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9e7b74' }}>
            <p style={{ fontSize: '20px', marginBottom: '12px' }}>No products found</p>
            <p style={{ fontSize: '14px' }}>Try a different filter or search term</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}