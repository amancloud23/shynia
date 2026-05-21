import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart ✓`);
  };

  const colors = { Gel: '#d4a5c9', Matte: '#c9a96e', Glossy: '#f7a8b0' };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #ecddd8',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
        cursor: 'pointer'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(61,43,39,0.12)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Image */}
        <div style={{
          height: '240px',
          background: `linear-gradient(135deg, #f7d6d0 0%, #e8cfc0 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: '60px', height: '120px',
              background: colors[product.category] || '#c9a96e',
              borderRadius: '30px 30px 8px 8px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }} />
          )}
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: '#fff', color: '#3d2b27',
            fontSize: '10px', letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '3px 10px',
            borderRadius: '20px'
          }}>
            {product.category}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px' }}>
          <h3 style={{
            fontSize: '16px', fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 400, marginBottom: '6px', color: '#3d2b27'
          }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#9e7b74', marginBottom: '14px' }}>
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '12px' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}