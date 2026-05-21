import { useState, useEffect } from 'react';
import api from '../api/axios';

const statusColors = {
  pending:   { bg: '#fff8e6', text: '#b07800', border: '#f5d58e' },
  shipped:   { bg: '#e6f0ff', text: '#1a4db0', border: '#8eb8f5' },
  delivered: { bg: '#e6fff0', text: '#1a7a40', border: '#8ef5bc' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#c9a96e' }}>Loading orders...</div>;

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
      <h2 style={{ fontSize: '28px', color: '#3d2b27', marginBottom: '12px' }}>No orders yet</h2>
      <p style={{ color: '#9e7b74' }}>Your order history will appear here</p>
    </div>
  );

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', color: '#3d2b27', marginBottom: '40px' }}>My Orders</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const sc = statusColors[order.status] || statusColors.pending;
            return (
              <div key={order.id} style={{
                background: '#fff', border: '1px solid #ecddd8',
                borderRadius: '4px', overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  padding: '16px 24px',
                  background: '#fffaf8',
                  borderBottom: '1px solid #ecddd8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order ID</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27', fontWeight: 500 }}>#{order.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Date</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27', fontWeight: 500 }}>${parseFloat(order.total_price).toFixed(2)}</p>
                    </div>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                    fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: '20px'
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.OrderItems?.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '50px', height: '50px',
                        background: 'linear-gradient(135deg, #f7d6d0, #e8cfc0)',
                        borderRadius: '4px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <div style={{ width: '16px', height: '36px', background: '#c9a96e', borderRadius: '8px 8px 3px 3px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', color: '#3d2b27' }}>{item.Product?.name || 'Product'}</p>
                        <p style={{ fontSize: '13px', color: '#9e7b74' }}>Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <p style={{ fontSize: '15px', color: '#3d2b27' }}>
                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}