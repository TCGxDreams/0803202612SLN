import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';
import Profile from '../components/Profile';
import LinkList from '../components/LinkList';
import { Share2, Check } from 'lucide-react';

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (username) fetchProfileByUsername(username);
  }, [username]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchProfileByUsername = async (uname) => {
    try {
      setLoading(true);
      setNotFound(false);
      if (!supabase) { setNotFound(true); setLoading(false); return; }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles').select('*').eq('username', uname).single();

      if (profileError || !profileData) { setNotFound(true); setLoading(false); return; }
      setProfile(profileData);

      const { data: linksData, error: linksError } = await supabase
        .from('links').select('*').eq('user_id', profileData.id).order('order', { ascending: true });

      if (!linksError && linksData) setLinks(linksData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <main className="app-container" style={{ justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center', animation: 'fadeInDown 0.6s ease' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '0.5rem',
              background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>404</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: '300' }}>
              Không tìm thấy <strong>@{username}</strong>
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'var(--gradient-accent)', color: '#0a0d14', border: 'none',
                padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: '600',
                cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-sans)',
                transition: 'transform 0.3s ease'
              }}
            >
              Quay về trang chủ
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      
      <main className="app-container">
        <div className="content-card">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        
          {loading ? (
            <div style={{ marginTop: '5rem', color: 'var(--text-secondary)', fontWeight: '300' }}>
              Đang tải @{username}...
            </div>
          ) : (
            <>
              <Profile 
                name={profile?.name} 
                bio={profile?.bio} 
                avatarUrl={profile?.avatar_url}
                username={username}
              />
            
              {/* Copy Link Button */}
              <button 
                className={`copy-link-btn ${copied ? 'copied' : ''}`}
                onClick={copyProfileLink}
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'Đã sao chép!' : 'Chia sẻ trang này'}
              </button>

              <LinkList links={links} />
            
              <div className="branding-footer">
                <span>Powered by <strong>SinhLN2326</strong></span>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
