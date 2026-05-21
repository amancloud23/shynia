import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const emptyForm = { name: '', description: '', price: '', image_url: '', category: 'Gel', stock: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);

  const loadProducts = () =>
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});

  useEffect(() => { loadProducts(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        toast.success('Product updated ✓');
      } else {
        await api.post('/products', form);
        toast.success('Product created ✓');
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, image_url: p.image_url || '', category: p.category, stock: p.stock });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #ecddd8', borderRadius: '2px',
    fontSize: '14px', color: '#3d2b27', outline: 'none', background: '#fffaf8'
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '32px', color: '#3d2b27' }}>Manage Products</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(s => !s); }} className="btn-primary" style={{ padding: '12px 24px' }}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '32px', marginBottom: '36px' }}>
            <h3 style={{ fontSize: '22px', color: '#3d2b27', marginBottom: '24px' }}>
              {editId ? 'Edit Product' : 'New Product'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Product Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Rose Petal Dreams" />
              </div>
              <div>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Price *</label>
                <input style={inputStyle} name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="19.99" />
              </div>
              <div>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Category *</label>
                <select style={inputStyle} name="category" value={form.category} onChange={handleChange}>
                  <option>Gel</option>
                  <option>Matte</option>
                  <option>Glossy</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Stock</label>
                <input style={inputStyle} name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Image URL</label>
                <input style={inputStyle} name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 36px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fffaf8' }}>
                {['ID', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e7b74', borderBottom: '1px solid #ecddd8', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #ecddd8' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#9e7b74' }}>#{p.id}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: '14px', color: '#3d2b27', fontWeight: 500 }}>{p.name}</p>
                    {p.description && <p style={{ fontSize: '12px', color: '#9e7b74', marginTop: '2px' }}>{p.description.slice(0, 50)}...</p>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#f7d6d0', color: '#8b5e52', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#3d2b27' }}>${parseFloat(p.price).toFixed(2)}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: p.stock > 5 ? '#3d7a3d' : p.stock > 0 ? '#b07800' : '#9e2020' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(p)} style={{
                        padding: '6px 16px', fontSize: '12px', letterSpacing: '0.08em',
                        textTransform: 'uppercase', border: '1px solid #3d2b27',
                        background: 'transparent', color: '#3d2b27', cursor: 'pointer', borderRadius: '2px'
                      }}>Edit</button>
                      <button onClick={() => handleDelete(p.id, p.name)} style={{
                        padding: '6px 16px', fontSize: '12px', letterSpacing: '0.08em',
                        textTransform: 'uppercase', border: '1px solid #e05555',
                        background: 'transparent', color: '#e05555', cursor: 'pointer', borderRadius: '2px'
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9e7b74' }}>
              No products yet. Add your first product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}