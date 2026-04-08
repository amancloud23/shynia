import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta_text: '',
    background_color: '#d4538a',
    text_color: '#fff',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/banners/admin/all');
      setBanners(response.data);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/banners/${editingId}`, formData);
        toast.success('Banner updated successfully!');
      } else {
        await api.post('/banners', formData);
        toast.success('Banner created successfully!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        subtitle: '',
        cta_text: '',
        background_color: '#d4538a',
        text_color: '#fff',
        image_url: '',
        display_order: 0,
        is_active: true
      });
      loadBanners();
    } catch (err) {
      toast.error(editingId ? 'Failed to update banner' : 'Failed to create banner');
    }
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted successfully!');
      loadBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      cta_text: '',
      background_color: '#d4538a',
      text_color: '#fff',
      image_url: '',
      display_order: 0,
      is_active: true
    });
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: '#3d2b27', margin: 0 }}>🎠 Manage Banner Sliders</h1>
            <p style={{ color: '#9e7b74', marginTop: '8px' }}>Create and manage home page banner slides</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/admin" style={{ padding: '12px 28px', border: '1px solid #c9a96e', borderRadius: '4px', color: '#c9a96e', textDecoration: 'none', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
              style={{ padding: '12px 28px' }}
            >
              {showForm ? '✕ Cancel' : '+ New Banner'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{
            background: '#fff',
            border: '1px solid #ecddd8',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontSize: '24px',
              color: '#3d2b27',
              marginBottom: '24px',
              marginTop: 0
            }}>
              {editingId ? '✏️ Edit Banner' : '🎠 Create New Banner'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., ✨ Luxury Nail Polish"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ecddd8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Finishes, Long-Lasting Color"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ecddd8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* CTA Text */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Button Text *
                  </label>
                  <input
                    type="text"
                    name="cta_text"
                    value={formData.cta_text}
                    onChange={handleInputChange}
                    placeholder="e.g., Shop Now"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ecddd8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Background Color */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Background Gradient Start Color
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="background_color"
                      value={formData.background_color}
                      onChange={handleInputChange}
                      style={{
                        width: '80px',
                        height: '50px',
                        border: '1px solid #ecddd8',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.background_color}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #ecddd8',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Text Color
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="text_color"
                      value={formData.text_color}
                      onChange={handleInputChange}
                      style={{
                        width: '80px',
                        height: '50px',
                        border: '1px solid #ecddd8',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.text_color}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #ecddd8',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                    Display Order (Lower = First)
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ecddd8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#3d2b27' }}>
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ecddd8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                {formData.image_url && (
                  <div style={{
                    marginTop: '12px',
                    maxWidth: '300px'
                  }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{
                        width: '100%',
                        borderRadius: '4px',
                        maxHeight: '200px',
                        objectFit: 'cover'
                      }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  color: '#3d2b27'
                }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  Active (Show on homepage)
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  {editingId ? '💾 Update Banner' : '✨ Create Banner'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '12px 28px',
                    border: '1px solid #ecddd8',
                    borderRadius: '4px',
                    color: '#9e7b74',
                    background: '#fff',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9e7b74' }}>
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9e7b74',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #ecddd8'
          }}>
            <p style={{ fontSize: '18px', margin: '0 0 12px 0' }}>No banners yet</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Create your first banner to showcase on the homepage!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {banners
              .sort((a, b) => a.display_order - b.display_order)
              .map(banner => (
                <div
                  key={banner.id}
                  style={{
                    background: banner.background_color,
                    color: banner.text_color,
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Background Image */}
                  {banner.image_url && (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.3
                      }}
                    />
                  )}

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          margin: '0 0 8px 0',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          {banner.title}
                        </h3>
                        {banner.subtitle && (
                          <p style={{
                            fontSize: '13px',
                            margin: 0,
                            opacity: 0.9
                          }}>
                            {banner.subtitle}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: banner.is_active ? 'rgba(106, 176, 76, 0.3)' : 'rgba(212, 83, 138, 0.3)',
                          color: banner.is_active ? '#6ab04c' : '#d4538a',
                          textTransform: 'uppercase'
                        }}
                      >
                        {banner.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </div>
                    </div>

                    <p style={{
                      fontSize: '12px',
                      margin: '12px 0',
                      opacity: 0.8
                    }}>
                      Order: {banner.display_order}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <button
                      onClick={() => handleEdit(banner)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.25)',
                        color: banner.text_color,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.15)',
                        color: banner.text_color,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(231, 76, 60, 0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
