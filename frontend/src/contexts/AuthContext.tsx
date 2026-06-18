import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export type Role = 'ADMIN' | 'ORGANIZER' | 'NOMINEE' | 'VOTER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: 'active' | 'suspended' | 'pending';
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  companyName?: string;
  registrationNumber?: string;
  phone?: string;
  ghanaCardNumber?: string;
  verificationDocumentUrl?: string;
  votePrice?: number;
  balance?: number;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

export function roleHomePath(role: Role): string {
  switch (role) {
    case 'ADMIN': return '/admin';
    case 'ORGANIZER': return '/dashboard';
    case 'NOMINEE': return '/nominee';
    case 'VOTER': return '/voter-dashboard';
    default: return '/';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const db = getFirestore(app);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch custom user profile (role, name) from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: (data.role as Role) || 'VOTER',
              status: (data.status as 'active' | 'suspended' | 'pending') || 'active',
              verificationStatus: data.verificationStatus,
              companyName: data.companyName,
              registrationNumber: data.registrationNumber,
              phone: data.phone,
              ghanaCardNumber: data.ghanaCardNumber,
              verificationDocumentUrl: data.verificationDocumentUrl,
              votePrice: data.votePrice,
              balance: data.balance || 0,
              imageUrl: data.imageUrl,
            });
          } else {
            // Fallback if no Firestore document exists yet
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'VOTER',
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore", error);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Provide a manual login setter for immediate UI updates during the login flow
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading session...</div>;
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
