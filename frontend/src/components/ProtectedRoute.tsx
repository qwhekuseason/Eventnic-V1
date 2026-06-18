import { Navigate, useLocation } from 'react-router-dom';
import { memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
  allowPending?: boolean;
}

const ProtectedRoute = memo(function ProtectedRoute({ children, allowedRoles, allowPending = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.status === 'suspended') {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ORGANIZER' && user.verificationStatus === 'PENDING' && !allowPending) {
    if (location.pathname !== '/dashboard') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access a page they shouldn't
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ORGANIZER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'NOMINEE') return <Navigate to="/nominee" replace />;
    if (user.role === 'VOTER') return <Navigate to="/voter-dashboard" replace />;
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
