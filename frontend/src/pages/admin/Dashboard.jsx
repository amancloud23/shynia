import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders/all')])
      .then(([pRes, oRes]) => {
        const products = pRes.data;
        const orders   = oRes.data;
        const revenue  = orders.reduce((s, o) => s + parseFloat(o.total_price), 0);
        const pending  = orders.filter(o => o.status === 'pending').length;
        setStats({ products: products.length, orders: orders.length, revenue, pending });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products,               icon: '💅', link: '/admin/products' },
    { label: 'Total Orders',   value: stats.orders,                 icon: '📦', link: '/admin/orders' },
    { label: 'Revenue',        value: `$${stats.revenue.toFixed(2)}`, icon: '💰', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pending,                icon: '⏳', link: '/admin/orders' }
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: '#3d2b27' }}>Admin Dashboard</h1>
            <p style={{ color: '#9e7b74', marginTop: '4px' }}>Welcome back, Admin ✦</p>
          </div>
          <Link to="/admin/products" className="btn-primary" style={{ padding: '12px 28px' }}>
            + Add Product
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {cards.map(c => (
            <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px',
                padding: '28px 24px', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,43,39,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{c.icon}</div>
                <p style={{ fontSize: '12px', color: '#9e7b74', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{c.label}</p>
                <p style={{ fontSize: '28px', color: '#3d2b27', fontFamily: 'Cormorant Garamond, serif' }}>{c.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #ecddd8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', color: '#3d2b27' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '13px', color: '#c9a96e', letterSpacing: '0.08em' }}>View All →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fffaf8' }}>
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', borderBottom: '1px solid #ecddd8' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={order.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #ecddd8' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#3d2b27' }}>#{order.id}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#3d2b27' }}>{order.User?.name || '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#3d2b27' }}>${parseFloat(order.total_price).toFixed(2)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: order.status === 'delivered' ? '#e6fff0' : order.status === 'shipped' ? '#e6f0ff' : '#fff8e6',
                      color: order.status === 'delivered' ? '#1a7a40' : order.status === 'shipped' ? '#1a4db0' : '#b07800',
                      fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '3px 10px', borderRadius: '20px'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9e7b74' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}