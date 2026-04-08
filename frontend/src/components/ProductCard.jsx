import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = React.useState(product.colors?.[0] || '');

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart ✓`);
  };

  const colors = { Gel: '#d4a5c9', Matte: '#c9a96e', Glossy: '#f7a8b0' };
  
  // Calculate discount percentage
  const discountPercent = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #f0eaea',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        animation: 'slideIn 0.5s ease both'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 24px 56px rgba(212, 83, 138, 0.25), 0 0 1px rgba(212, 83, 138, 0.2)';
          e.currentTarget.style.transform = 'translateY(-12px)';
          e.currentTarget.style.borderColor = 'rgba(212, 83, 138, 0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(61, 43, 39, 0.1), 0 0 1px rgba(212, 83, 138, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(236, 221, 216, 0.8)';
        }}
      >
        {/* Image */}
        <div style={{
          height: '280px',
          background: `linear-gradient(135deg, #f7d6d0 0%, #e8cfc0 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onError={e => { e.target.style.display = 'none'; }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              width: '60px', height: '120px',
              background: colors[product.category] || '#c9a96e',
              borderRadius: '30px 30px 8px 8px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25), inset 0 -2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.4s ease'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) rotateZ(2deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotateZ(0deg)'}
            />
          )}

          {/* Badge (NEW, BESTSELLER, HOT SELLER) */}
          {product.badge_type && (
            <div style={{
              position: 'absolute',
              top: '12px', left: '12px',
              background: product.badge_type === 'NEW' ? '#6ab04c' : 
                         product.badge_type === 'BESTSELLER' ? '#f39c12' : '#e74c3c',
              color: 'white',
              fontSize: '10px', letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              {product.badge_type}
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div style={{
              position: 'absolute',
              top: '12px', right: '12px',
              background: '#d4538a',
              color: 'white',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(212, 83, 138, 0.3)'
            }}>
              {discountPercent}% OFF
            </div>
          )}

          {/* Category Badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px', left: '12px',
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(12px)',
            color: '#3d2b27',
            fontSize: '10px', letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '6px 14px',
            borderRadius: '24px',
            fontWeight: 700,
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(212, 83, 138, 0.2)'
          }}>
            {product.category}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '24px 22px 20px' }}>
          <h3 style={{
            fontSize: '17px', fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 700, marginBottom: '10px', color: '#3d2b27',
            letterSpacing: '0.08em', lineHeight: '1.4'
          }}>
            {product.name}
          </h3>

          {/* Star Rating */}
          {product.rating && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <span style={{ 
                color: '#f39c12', 
                fontWeight: 700,
                fontSize: '16px'
              }}>
                {'★'.repeat(Math.round(product.rating))}
              </span>
              <span style={{ 
                color: '#f39c12', 
                fontWeight: 700,
                fontSize: '14px'
              }}>
                {parseFloat(product.rating).toFixed(1)}
              </span>
              <span style={{ 
                color: '#6ab04c', 
                fontSize: '10px',
                fontWeight: 800
              }}>
                ●
              </span>
              <span style={{ 
                color: '#999', 
                fontSize: '13px',
                fontWeight: 600
              }}>
                {product.reviews_count || 0} {product.reviews_count === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          )}

          {/* Pricing */}
          <div style={{ marginBottom: '14px' }}>
            {product.sale_price ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '15px', color: '#d4538a', fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  ₹{parseFloat(product.sale_price).toFixed(0)}
                </span>
                <span style={{
                  fontSize: '12px', color: '#999',
                  textDecoration: 'line-through', fontWeight: 600
                }}>
                  ₹{parseFloat(product.price).toFixed(0)}
                </span>
              </div>
            ) : (
              <span style={{
                fontSize: '15px', color: '#d4538a', fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                ₹{parseFloat(product.price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Trust Badges */}
          {(product.is_cruelty_free || product.is_vegan) && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '14px',
              fontSize: '11px',
              fontWeight: 600
            }}>
              {product.is_cruelty_free && (
                <span style={{
                  background: 'rgba(106, 176, 76, 0.1)',
                  color: '#6ab04c',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  🐰 Cruelty-free
                </span>
              )}
              {product.is_vegan && (
                <span style={{
                  background: 'rgba(106, 176, 76, 0.1)',
                  color: '#6ab04c',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  🌱 Vegan
                </span>
              )}
            </div>
          )}

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '14px',
              flexWrap: 'wrap'
            }}>
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: selectedColor === color ? '2px solid #d4538a' : '2px solid #ddd',
                    background: color,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedColor === color ? `0 0 12px ${color}99` : 'none'
                  }}
                  title={color}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}