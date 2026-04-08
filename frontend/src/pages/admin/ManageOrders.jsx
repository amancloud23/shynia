import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const statusColors = {
  pending:   { bg: '#fff8e6', text: '#b07800', border: '#f5d58e' },
  confirmed: { bg: '#e6f5e6', text: '#1a7a40', border: '#8ef5bc' },
  shipped:   { bg: '#e6f0ff', text: '#1a4db0', border: '#8eb8f5' },
  delivered: { bg: '#e6fff0', text: '#1a7a40', border: '#8ef5bc' }
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/orders/all')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Order status updated ✓');
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#c9a96e' }}>Loading orders...</div>;

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '32px', color: '#3d2b27' }}>Manage Orders</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'pending', 'shipped', 'delivered'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '7px 16px', fontSize: '12px', letterSpacing: '0.08em',
                textTransform: 'uppercase', border: '1.5px solid',
                borderColor: filter === s ? '#3d2b27' : '#ecddd8',
                background: filter === s ? '#3d2b27' : 'transparent',
                color: filter === s ? '#fff' : '#9e7b74',
                borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(order => {
            const sc = statusColors[order.status] || statusColors.pending;
            return (
              <div key={order.id} style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{
                  padding: '16px 24px', background: '#fffaf8', borderBottom: '1px solid #ecddd8',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27', fontWeight: 500 }}>#{order.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Customer</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27' }}>{order.User?.name || '—'}</p>
                      <p style={{ fontSize: '12px', color: '#9e7b74' }}>{order.User?.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27', fontWeight: 500 }}>₹{parseFloat(order.total_price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Date</p>
                      <p style={{ fontSize: '15px', color: '#3d2b27' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                      fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '4px 12px', borderRadius: '20px'
                    }}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      style={{
                        padding: '7px 12px', border: '1px solid #ecddd8', borderRadius: '2px',
                        fontSize: '13px', color: '#3d2b27', background: '#fff', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '16px 24px' }}>
                  {order.OrderItems?.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '6px 0', borderBottom: '1px solid #f5ede9' }}>
                      <span style={{ color: '#3d2b27' }}>{item.Product?.name} × {item.quantity}</span>
                      <span style={{ color: '#9e7b74' }}>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9e7b74' }}>
              No orders found{filter ? ` with status: ${filter}` : ''}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}