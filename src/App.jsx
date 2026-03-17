import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import PublicProfile from './pages/PublicProfile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only try to fetch session if supabase is actually configured
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <Navigate to="/" replace />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
