import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth, roleHomePath } from '../contexts/AuthContext';
import type { User, Role } from '../contexts/AuthContext';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function LoginEventnic() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch role from Firestore
      const db = getFirestore(app);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let role: Role = 'VOTER';
      let name = email.split('@')[0];
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        role = (data.role as Role) || 'VOTER';
        name = data.name || name;
      }
      
      const userData: User = {
        id: userCredential.user.uid,
        name: name,
        email: email,
        role: role,
        status: (userDoc.exists() ? (userDoc.data().status as 'active' | 'suspended' | 'pending') : 'active') || 'active',
        verificationStatus: userDoc.exists() ? userDoc.data().verificationStatus : undefined,
        companyName: userDoc.exists() ? userDoc.data().companyName : undefined,
        registrationNumber: userDoc.exists() ? userDoc.data().registrationNumber : undefined,
        phone: userDoc.exists() ? userDoc.data().phone : undefined,
        ghanaCardNumber: userDoc.exists() ? userDoc.data().ghanaCardNumber : undefined,
        verificationDocumentUrl: userDoc.exists() ? userDoc.data().verificationDocumentUrl : undefined,
        votePrice: userDoc.exists() ? userDoc.data().votePrice : undefined,
        balance: userDoc.exists() ? userDoc.data().balance : undefined,
      };

      if (userData.status === 'suspended') {
        await signOut(getAuth(app));
        setError('This account is suspended. Contact support for help.');
        setLoading(false);
        return;
      }

      login(userData);
      navigate(roleHomePath(role));
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-[96px]">
        <div className="mx-auto w-full max-w-[420px] lg:w-[420px]">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <Link to="/" className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Home
            </Link>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-on-surface">Sign in to your account</h2>
          <p className="mt-2 text-sm text-secondary">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-container transition-colors">
              create a new account for free
            </Link>
          </p>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-lg bg-error-container p-4 border border-error/30">
                <p className="text-sm text-on-error-container">{error}</p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-on-surface">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" defaultChecked className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">Remember me</label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-container transition-colors">Forgot your password?</Link>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-container hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block hero-section overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/stitch-9bf3cc8257fe8d98.png')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[80px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/40 blur-[80px]"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
          <div className="max-w-[512px] w-full space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Manage Events <br/> <span className="text-tertiary">Like a Pro</span></h2>
            <p className="text-lg font-medium text-white/80">Join thousands of organizers running seamless events globally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
