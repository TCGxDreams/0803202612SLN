import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, KeyRound } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!supabase) {
      setError("Supabase client not initialized.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!supabase) {
      setError("Supabase client not initialized.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Tài khoản đã được tạo! Hãy đăng nhập.");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Vui lòng nhập email để đặt lại mật khẩu.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Link đổi mật khẩu đã được gửi vào email của bạn!");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      
      <div className="app-container" style={{ justifyContent: 'center', minHeight: '85vh' }}>
        <div style={{ 
          background: 'var(--glass-bg)', 
          padding: '2.5rem 2rem', 
          borderRadius: '20px', 
          border: '1px solid var(--glass-border)',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            marginBottom: '0.25rem', 
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SinhLN2326
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.85rem', fontWeight: '300' }}>
            {showChangePassword ? 'Nhập email để đặt lại mật khẩu' : 'Đăng nhập để quản lý links'}
          </p>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            {!showChangePassword && (
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            )}
            
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', margin: '0.25rem 0' }}>{error}</p>}
            {success && <p style={{ color: '#22c55e', fontSize: '0.85rem', textAlign: 'center', margin: '0.25rem 0' }}>{success}</p>}
            
            {showChangePassword ? (
              <>
                <button 
                  onClick={handleChangePassword} 
                  disabled={loading}
                  style={{ ...buttonStyle, background: 'var(--gradient-accent)', color: '#0a0d14' }}
                >
                  <KeyRound size={16} />
                  {loading ? 'Đang gửi...' : 'Gửi link đổi mật khẩu'}
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); setShowChangePassword(false); setError(null); setSuccess(null); }}
                  style={{ ...buttonStyle, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                >
                  Quay lại đăng nhập
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin} 
                  disabled={loading}
                  style={{ ...buttonStyle, background: 'var(--gradient-accent)', color: '#0a0d14' }}
                >
                  <LogIn size={16} />
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
                
                <button 
                  onClick={handleSignUp} 
                  disabled={loading}
                  style={{ ...buttonStyle, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                >
                  <UserPlus size={16} />
                  Đăng ký
                </button>

                <button 
                  onClick={(e) => { e.preventDefault(); setShowChangePassword(true); setError(null); setSuccess(null); }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-secondary)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-sans)',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Quên mật khẩu?
                </button>
              </>
            )}
          </form>
        </div>

        <div className="branding-footer" style={{ borderTop: 'none', marginTop: '0.5rem' }}>
          <span>Powered by <strong>SinhLN2326</strong></span>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(0,0,0,0.15)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const buttonStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  border: 'none',
  fontFamily: 'var(--font-sans)',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
};
