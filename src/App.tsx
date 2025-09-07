import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import NotFound from './pages/NotFound';

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
