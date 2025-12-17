import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { authUser, token } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a moment for auth to initialize
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [authUser, token]);

  useEffect(() => {
    if (!isChecking) {
      // Check if user is trying to access admin panel without proper authorization
      if (requireAdmin && authUser && authUser.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
      } else if (!token || !authUser) {
        toast.error('Please login to continue');
      }
    }
  }, [isChecking, authUser, token, requireAdmin]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-beige to-cream-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-brown"></div>
      </div>
    );
  }

  // Check if user is logged in
  if (!token || !authUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && authUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
