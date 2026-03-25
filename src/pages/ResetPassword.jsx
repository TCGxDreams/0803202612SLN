import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
        <div className="app-container" style={{ justifyContent: 'center', minHeight: '85vh' }}>
          <div style={cardStyle}>
            <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', textAlign: 'center' }}>
              Đổi mật khẩu thành công!
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
            <button onClick={() => navigate('/')} style={primaryBtnStyle}>
              <ArrowLeft size={18} />
              Về trang đăng nhập
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="app-container" style={{ justifyContent: 'center', minHeight: '85vh' }}>
        <div style={cardStyle}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '800',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.25rem',
            textAlign: 'center'
          }}>
            Đặt mật khẩu mới
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            <input
              type="password"
              placeholder="Mật khẩu mới (≥ 6 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              <KeyRound size={18} />
              {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  background: 'var(--bg-secondary)',
  padding: '3rem 2.5rem',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '460px',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const inputStyle = {
  width: '100%',
  padding: '1rem 1.25rem',
  borderRadius: '16px',
  border: '1.5px solid rgba(199, 164, 246, 0.2)',
  background: 'rgba(0,0,0,0.03)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '1.05rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
};

const primaryBtnStyle = {
  width: '100%',
  padding: '1rem 1.25rem',
  borderRadius: '16px',
  border: 'none',
  fontFamily: 'var(--font-sans)',
  fontWeight: '600',
  fontSize: '1.05rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  background: 'var(--gradient-accent)',
  color: '#ffffff',
  boxShadow: '0 4px 15px rgba(199, 164, 246, 0.4)'
};
