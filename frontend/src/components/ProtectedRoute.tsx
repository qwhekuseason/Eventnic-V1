import { Navigate } from 'react-router-dom';
import { memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = memo(function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access a page they shouldn't
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ORGANIZER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'NOMINEE') return <Navigate to="/nominee" replace />;
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
