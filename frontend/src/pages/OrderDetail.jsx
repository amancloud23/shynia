import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
const statusLabels = {
  pending: 'Order Placed',           // waiting confirmation
  confirmed: 'Accepted',            // admin confirmed order
  shipped: 'On the Way',            // shipped/in transit
  delivered: 'Delivered'            // reached customer
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(e => setError(e.response?.data?.message || 'Unable to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const renderSteps = (current) => {
    return statusOrder.map((stat, idx) => {
      const active = statusOrder.indexOf(current) >= idx;
      return (
        <div key={stat} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            width: '24px', height: '24px', margin: '0 auto 4px',
            borderRadius: '50%', background: active ? '#c9a96e' : '#ecddd8'
          }} />
          <div style={{ fontSize: '12px', color: active ? '#3d2b27' : '#9e7b74' }}>
            {statusLabels[stat]}
          </div>
          {idx < statusOrder.length - 1 && (
            <div style={{
              height: '2px', background: active ? '#c9a96e' : '#ecddd8',
              margin: '8px auto', width: '60%'
            }} />
          )}
        </div>
      );
    });
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '80px', textAlign: 'center', color: '#e74c3c' }}>{error}</div>;

  const sc = {
    pending:   { bg: '#fff8e6', text: '#b07800', border: '#f5d58e' },
    confirmed: { bg: '#e6f5e6', text: '#1a7a40', border: '#8ef5bc' },
    shipped:   { bg: '#e6f0ff', text: '#1a4db0', border: '#8eb8f5' },
    delivered: { bg: '#e6fff0', text: '#1a7a40', border: '#8ef5bc' }
  };

  const statusColor = sc[order.status] || sc.pending;

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', fontSize: '14px' }}>← Back</button>
        <h1 style={{ fontSize: '32px', color: '#3d2b27', marginBottom: '20px' }}>Order #{order.id}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <span style={{
            background: statusColor.bg, color: statusColor.text,
            border: `1px solid ${statusColor.border}`,
            fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: '20px'
          }}>{order.status}</span>
        </div>

        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
          {renderSteps(order.status)}
        </div>

        <h2 style={{ fontSize: '24px', color: '#3d2b27', marginBottom: '16px' }}>Items</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {order.OrderItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.Product?.name} × {item.quantity}</span>
              <span>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', color: '#3d2b27', margin: '24px 0 12px' }}>Summary</h2>
        <p>Total: ₹{parseFloat(order.total_price).toFixed(2)}</p>
        <p>Payment method: {order.payment_method}</p>
      </div>
    </div>
  );
}