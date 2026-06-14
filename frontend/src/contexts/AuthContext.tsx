import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Role = 'ADMIN' | 'ORGANIZER' | 'NOMINEE' | 'ATTENDEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

/**
 * Simulates a server-side role lookup. In a real backend the role would be
 * derived from the authenticated session / JWT claims — never chosen by the
 * client. This keeps role-based access control off the UI and "in the background".
 */
export function resolveRole(email: string): Role {
  const e = email.trim().toLowerCase();
  if (e === 'admin@eventnic.com') return 'ADMIN';
  if (e === 'nominee@eventnic.com') return 'NOMINEE';
  if (e === 'organizer@eventnic.com') return 'ORGANIZER';
  return 'ATTENDEE';
}

/** Landing route for a given role after authentication. */
export function roleHomePath(role: Role): string {
  switch (role) {
    case 'ADMIN': return '/admin';
    case 'ORGANIZER': return '/dashboard';
    case 'NOMINEE': return '/nominee';
    default: return '/my-tickets';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('eventnic_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('eventnic_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventnic_user');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
