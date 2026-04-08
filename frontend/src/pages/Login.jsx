import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! ✨`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f7d6d0 0%, #faf5f3 50%, #e8cfc0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(236, 221, 216, 0.8)',
        borderRadius: '16px',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 60px rgba(212, 83, 138, 0.15), 0 0 60px rgba(61, 43, 39, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '36px',
            background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.2em',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            ✦ SHYNIA
          </h1>
          <p style={{ color: '#9e7b74', fontSize: '14px', letterSpacing: '0.05em' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {[
            { name: 'email',    label: 'Email Address',    type: 'email',    placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }
          ].map(f => (
            <div key={f.name}>
              <label style={{
                display: 'block', fontSize: '12px', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#8b5e52', marginBottom: '8px',
                fontWeight: 600
              }}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #ecddd8', borderRadius: '8px',
                  fontSize: '14px', color: '#3d2b27', outline: 'none',
                  background: 'rgba(255, 248, 246, 0.7)',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#d4538a';
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(212, 83, 138, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#ecddd8';
                  e.target.style.background = 'rgba(255, 248, 246, 0.7)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary" style={{
            width: '100%', padding: '14px', marginTop: '12px',
            opacity: loading ? 0.8 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#9e7b74',
          letterSpacing: '0.05em'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#d4538a', fontWeight: 600,
            textDecoration: 'none', transition: 'color 0.3s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
            onMouseLeave={e => e.currentTarget.style.color = '#d4538a'}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}