import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6)       { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to SHYNIA, ${res.data.user.name}! ✨`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f7d6d0 0%, #fffaf8 100%)', padding: '40px 20px'
    }}>
      <div style={{
        background: '#fff', border: '1px solid #ecddd8', borderRadius: '4px',
        padding: '48px', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(61,43,39,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', color: '#3d2b27', letterSpacing: '0.2em', marginBottom: '8px' }}>
            Join SHYNIA
          </h1>
          <p style={{ color: '#9e7b74', fontSize: '14px' }}>Create your beauty account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { name: 'name',     label: 'Full Name', type: 'text',     placeholder: 'Your Name' },
            { name: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@example.com' },
            { name: 'password', label: 'Password',  type: 'password', placeholder: '6+ characters' },
            { name: 'confirm',  label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' }
          ].map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5e52', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                type={f.type} name={f.name} placeholder={f.placeholder}
                value={form[f.name]}
                onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '1px solid #ecddd8', borderRadius: '2px',
                  fontSize: '14px', color: '#3d2b27', outline: 'none', background: '#fffaf8'
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#9e7b74' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c9a96e', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}