import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Link as LinkIcon, ExternalLink, Copy, Check, Lock } from 'lucide-react';

export default function AdminDashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', bio: '', avatar_url: '', username: '' });
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon_name: 'website' });
  const [copied, setCopied] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [changingPw, setChangingPw] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data: profileDetails, error: profileError } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles').insert([{ id: user.id }]).select().single();
        if (!insertError) profileDetails = newProfile;
      }

      if (profileDetails) {
        setProfile({
          name: profileDetails.name || '',
          bio: profileDetails.bio || '',
          avatar_url: profileDetails.avatar_url || '',
          username: profileDetails.username || ''
        });
      }

      const { data: linksData, error: linksError } = await supabase
        .from('links').select('*').eq('user_id', user.id).order('order', { ascending: true });

      if (!linksError && linksData) setLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { user } = session;
      const updates = { id: user.id, ...profile, updated_at: new Date() };
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert('Cập nhật thành công!');
    } catch (error) {
      alert(error.message);
    }
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    try {
      const { user } = session;
      const nextOrder = links.length > 0 ? Math.max(...links.map(l => l.order)) + 1 : 1;
      const linkData = { user_id: user.id, title: newLink.title, url: newLink.url, icon_name: newLink.icon_name, order: nextOrder };
      const { data, error } = await supabase.from('links').insert([linkData]).select();
      if (error) throw error;
      setLinks([...links, data[0]]);
      setNewLink({ title: '', url: '', icon_name: 'website' });
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteLink = async (id) => {
    try {
      const { error } = await supabase.from('links').delete().eq('id', id);
      if (error) throw error;
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const copyProfileLink = async () => {
    const url = `${window.location.origin}/${profile.username}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);
    setChangingPw(true);

    if (newPassword.length < 6) {
      setPasswordErr('Mật khẩu mới phải ít nhất 6 ký tự.');
      setChangingPw(false);
      return;
    }

    // Verify old password by re-signing in
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: oldPassword,
    });

    if (signInErr) {
      setPasswordErr('Mật khẩu cũ không đúng.');
      setChangingPw(false);
      return;
    }

    // Update to new password
    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateErr) {
      setPasswordErr(updateErr.message);
    } else {
      setPasswordMsg('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
    }
    setChangingPw(false);
  };

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <main className="app-container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <header style={headerStyle}>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '700',
            background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            SinhLN2326
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {profile.username && (
              <button style={headerBtnStyle} onClick={copyProfileLink} title="Copy link">
                {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
              </button>
            )}
            {profile.username && (
              <button style={headerBtnStyle} onClick={() => navigate(`/${profile.username}`)} title="Xem trang">
                <ExternalLink size={16} />
              </button>
            )}
            <button style={{ ...headerBtnStyle, color: '#ef4444' }} onClick={handleSignOut} title="Đăng xuất">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-secondary)', fontWeight: '300', marginTop: '2rem' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            
            {/* Profile Section */}
            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Thông tin cá nhân</h2>
              <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Username (URL: /{profile.username})</label>
                  <input style={inputStyle} type="text" value={profile.username} 
                    onChange={e => setProfile({...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')})} 
                    placeholder="your_username" />
                </div>
                <div>
                  <label style={labelStyle}>Tên hiển thị</label>
                  <input style={inputStyle} type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Giới thiệu</label>
                  <textarea style={{...inputStyle, resize: 'vertical', minHeight: '70px'}} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Ảnh đại diện (Google Drive link)</label>
                  <input style={inputStyle} type="url" placeholder="https://..." value={profile.avatar_url} onChange={e => setProfile({...profile, avatar_url: e.target.value})} />
                </div>
                <button type="submit" style={primaryBtnStyle}>Lưu thông tin</button>
              </form>
            </section>

            {/* Links Section */}
            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Quản lý liên kết</h2>
              
              {/* Add New Link */}
              <form onSubmit={addLink} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ flex: '1 1 180px' }}>
                  <input required style={inputStyle} type="text" placeholder="Tiêu đề" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} />
                </div>
                <div style={{ flex: '2 1 250px' }}>
                  <input required style={inputStyle} type="url" placeholder="URL (https://...)" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                </div>

                <button type="submit" style={{ ...primaryBtnStyle, flex: '0 0 auto', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} /> Thêm
                </button>
              </form>

              {/* List Current Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontWeight: '300' }}>Chưa có liên kết nào.</p>
                ) : (
                  links.map(link => (
                    <div key={link.id} style={linkItemStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: 0 }}>
                        <div style={{ 
                          width: '36px', height: '36px', background: 'var(--gradient-accent)', 
                          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <LinkIcon size={16} color="#0a0d14" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{link.title}</p>
                          <a href={link.url} target="_blank" rel="noreferrer" style={{ 
                            fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none',
                            display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>{link.url}</a>
                        </div>
                      </div>
                      <button onClick={() => deleteLink(link.id)} style={deleteBtnStyle}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Change Password Toggle */}
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)} 
                style={{ 
                  ...primaryBtnStyle, width: '100%', alignSelf: 'stretch',
                  background: 'transparent', border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.5rem', padding: '0.85rem'
                }}
              >
                <Lock size={16} /> Đổi mật khẩu
              </button>
            ) : (
              <section style={cardStyle}>
                <h2 style={sectionTitleStyle}>
                  <Lock size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />Đổi mật khẩu
                </h2>
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Mật khẩu cũ</label>
                    <input style={inputStyle} type="password" placeholder="Nhập mật khẩu hiện tại" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Mật khẩu mới</label>
                    <input style={inputStyle} type="password" placeholder="Nhập mật khẩu mới (>= 6 ký tự)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  {passwordErr && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{passwordErr}</p>}
                  {passwordMsg && <p style={{ color: '#22c55e', fontSize: '0.85rem' }}>{passwordMsg}</p>}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" disabled={changingPw} style={primaryBtnStyle}>
                      {changingPw ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                    <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordErr(null); setPasswordMsg(null); setOldPassword(''); setNewPassword(''); }}
                      style={{ ...primaryBtnStyle, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                    >
                      Huỷ
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}

const headerStyle = {
  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '0.85rem 1.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)', borderRadius: '14px',
  border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)'
};

const headerBtnStyle = {
  padding: '0.5rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)',
  borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease'
};

const cardStyle = {
  width: '100%', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)', borderRadius: '16px',
  border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '1.5rem'
};

const sectionTitleStyle = {
  marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)',
  fontSize: '1.1rem', fontWeight: '600'
};

const labelStyle = { display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '400' };

const inputStyle = {
  width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
  border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.15)',
  color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', outline: 'none',
  transition: 'border-color 0.3s ease'
};

const primaryBtnStyle = {
  background: 'var(--gradient-accent)', color: '#0a0d14', border: 'none',
  padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
  fontFamily: 'var(--font-sans)', fontSize: '0.95rem', alignSelf: 'flex-start',
  transition: 'transform 0.3s ease'
};

const linkItemStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  background: 'rgba(0,0,0,0.1)', padding: '0.85rem', borderRadius: '10px',
  border: '1px solid var(--glass-border)', transition: 'background 0.3s ease'
};

const deleteBtnStyle = {
  background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer',
  padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center',
  transition: 'background 0.3s ease'
};
