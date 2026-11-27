import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { authUser, token, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-beige to-cream-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-brown" />
      </div>
    );
  }

  if (!token || !authUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && authUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
