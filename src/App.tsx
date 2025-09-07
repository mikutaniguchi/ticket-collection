import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/tickets" /> : <Login />}
      />
      <Route
        path="/tickets"
        element={user ? <Tickets /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets/new"
        element={user ? <CreateTicket /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets/:id"
        element={user ? <TicketDetail /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets/:id/edit"
        element={user ? <EditTicket /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={user ? '/tickets' : '/login'} />}
      />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // iPhone Safari のオーバースクロール（バウンス）防止
    const preventBounce = (e: TouchEvent) => {
      // ページ全体がスクロール範囲を超えた場合のタッチを防止
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop === 0 || scrollTop + windowHeight >= scrollHeight) {
        e.preventDefault();
      }
    };

    // iOSデバイスの場合のみ適用
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.addEventListener('touchmove', preventBounce, { passive: false });
    }

    return () => {
      if (isIOS) {
        document.removeEventListener('touchmove', preventBounce);
      }
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
