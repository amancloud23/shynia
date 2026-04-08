import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ upi_id: '', name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/auth/admin/settings');
      setSettings(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.upi_id.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/auth/admin/settings', { upi_id: settings.upi_id });
      toast.success(res.data.message);
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px', color: '#c9a96e' }}>Loading settings...</div>;
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ecddd8',
    borderRadius: '2px',
    fontSize: '14px',
    color: '#3d2b27',
    outline: 'none',
    background: '#fffaf8'
  };

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', color: '#3d2b27', marginBottom: '40px' }}>Admin Settings</h1>

        <div style={{ maxWidth: '600px' }}>
          {/* Account Info */}
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#3d2b27' }}>Account Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5e52', marginBottom: '6px' }}>
                  Name
                </label>
                <div style={{ ...inputStyle, padding: '12px 16px', background: '#f5ede9', cursor: 'not-allowed' }}>
                  {settings.name}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5e52', marginBottom: '6px' }}>
                  Email
                </label>
                <div style={{ ...inputStyle, padding: '12px 16px', background: '#f5ede9', cursor: 'not-allowed' }}>
                  {settings.email}
                </div>
              </div>
            </div>
          </div>

          {/* UPI Settings */}
          <div style={{ background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#3d2b27', margin: 0 }}>UPI Payment Account</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#c9a96e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {!editMode ? (
              <div>
                {settings.upi_id ? (
                  <div style={{ padding: '16px', background: '#f5ede9', borderRadius: '4px', border: '1px solid #ecddd8' }}>
                    <p style={{ fontSize: '12px', color: '#9e7b74', marginBottom: '8px' }}>📱 UPI ID</p>
                    <p style={{ fontSize: '18px', color: '#3d2b27', fontWeight: 500, margin: 0 }}>
                      {settings.upi_id}
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '16px', background: '#fff8e6', borderRadius: '4px', border: '1px solid #f5d58e' }}>
                    <p style={{ fontSize: '13px', color: '#b07800', margin: 0 }}>
                      ⚠️ No UPI ID configured. Set your UPI account to receive payments.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5e52', marginBottom: '6px' }}>
                    UPI ID (e.g., yourname@okhdfcbank)
                  </label>
                  <input
                    type="text"
                    placeholder="user@okhdfcbank"
                    value={settings.upi_id}
                    onChange={e => setSettings(s => ({ ...s, upi_id: e.target.value }))}
                    style={inputStyle}
                  />
                  <p style={{ fontSize: '11px', color: '#9e7b74', marginTop: '8px', margin: '0' }}>
                    💡 Example formats: yourname@okhdfcbank, yourname@oksbi, yourname@okaxis
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '12px 24px',
                      background: '#c9a96e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '14px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: 500,
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save UPI ID'}
                  </button>

                  <button
                    onClick={() => {
                      setEditMode(false);
                      fetchSettings(); // Revert to original
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#e8cfc0',
                      color: '#3d2b27',
                      border: '1px solid #ecddd8',
                      borderRadius: '2px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#e6fff0', border: '1px solid #a8d5a2', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '14px', color: '#1a7a40', margin: '0 0 8px 0' }}>💚 How it works</h4>
              <ul style={{ fontSize: '12px', color: '#1a7a40', paddingLeft: '20px', margin: '0' }}>
                <li>Customers pay via UPI during checkout</li>
                <li>You receive payment in: <strong>{settings.upi_id || 'Your UPI Account'}</strong></li>
                <li>Payments are instant and secure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
