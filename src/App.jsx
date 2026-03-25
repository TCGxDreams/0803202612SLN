import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import PublicProfile from './pages/PublicProfile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check URL hash for recovery token BEFORE session loads
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }

      // Only stop loading after first auth event
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isRecovery ? <Navigate to="/reset-password" replace /> :
          session ? <Navigate to="/admin" replace /> : <Login />
        } />
        <Route path="/reset-password" element={
          isRecovery || session ? <ResetPassword /> : <Navigate to="/" replace />
        } />
        <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <Navigate to="/" replace />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
