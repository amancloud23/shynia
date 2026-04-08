import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#c9a96e' }}>Loading...</div>;
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <p>Product not found.</p>
      <Link to="/products" className="btn-outline" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Collection</Link>
    </div>
  );

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart ✓`);
  };

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <Link to="/products" style={{ fontSize: '13px', color: '#9e7b74', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '36px' }}>
          ← Back to Collection
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Image */}
          <div style={{
            background: 'linear-gradient(135deg, #f7d6d0, #e8cfc0)',
            borderRadius: '4px',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <div style={{
                width: '80px', height: '180px',
                background: '#c9a96e',
                borderRadius: '40px 40px 10px 10px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.15)'
              }} />
            )}
          </div>

          {/* Details */}
          <div style={{ paddingTop: '20px' }}>
            <span style={{
              background: '#f7d6d0', color: '#8b5e52',
              fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '4px 14px',
              borderRadius: '20px', display: 'inline-block', marginBottom: '16px'
            }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '42px', color: '#3d2b27', marginBottom: '12px', lineHeight: 1.1 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '28px', color: '#c9a96e', marginBottom: '24px', fontFamily: 'Cormorant Garamond, serif' }}>
              ₹{parseFloat(product.price).toFixed(2)}
            </p>
            <p style={{ fontSize: '15px', color: '#8b5e52', lineHeight: 1.8, marginBottom: '32px' }}>
              {product.description || 'A luxurious nail polish crafted with premium pigments for a flawless, long-lasting finish.'}
            </p>

            <div style={{
              padding: '16px 20px',
              background: product.stock > 0 ? '#f0faf0' : '#fdf0f0',
              border: `1px solid ${product.stock > 0 ? '#a8d5a2' : '#f5b8b8'}`,
              borderRadius: '4px',
              marginBottom: '28px',
              fontSize: '13px',
              color: product.stock > 0 ? '#3d7a3d' : '#9e2020'
            }}>
              {product.stock > 0 ? `✓ In Stock — ${product.stock} available` : '✗ Out of Stock'}
            </div>

            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ecddd8', borderRadius: '2px' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                    width: '40px', height: '40px', background: 'none', border: 'none',
                    fontSize: '18px', cursor: 'pointer', color: '#3d2b27'
                  }}>−</button>
                  <span style={{ width: '40px', textAlign: 'center', fontSize: '15px' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{
                    width: '40px', height: '40px', background: 'none', border: 'none',
                    fontSize: '18px', cursor: 'pointer', color: '#3d2b27'
                  }}>+</button>
                </div>
                <button onClick={handleAdd} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  Add to Cart
                </button>
              </div>
            )}

            <div style={{ borderTop: '1px solid #ecddd8', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['🚚', 'Free shipping on orders over $50'],
                ['✦', 'Cruelty-free & vegan formula'],
                ['♻️', 'Eco-conscious packaging']
              ].map(([icon, text]) => (
                <p key={text} style={{ fontSize: '13px', color: '#9e7b74' }}>
                  {icon} &nbsp; {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}