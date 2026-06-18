import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import type { User, Role } from '../contexts/AuthContext';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function SignupEventnic() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (value: string) => {
    if (value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
      return 'strong';
    }
    if (value.length >= 9 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
      return 'fair';
    }
    return 'weak';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const role: Role = 'ORGANIZER'; // Default role for self-signup
      const db = getFirestore(app);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name || 'New User',
        email,
        role,
        status: 'pending',
        verificationStatus: 'PENDING',
        votePrice: 0,
        balance: 0,
        createdAt: new Date().toISOString()
      });

      const userData: User = {
        id: userCredential.user.uid,
        name: name || 'New User',
        email,
        role,
        status: 'pending',
        verificationStatus: 'PENDING'
      };

      login(userData);
      navigate('/signup/verification');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/stitch-d87c03b4f4503fee.png')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        
        {/* Decorative glass elements */}
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/40 blur-[80px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[80px]"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
          <div className="max-w-[512px] w-full space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Scale Your <br/> <span className="text-tertiary">Audience</span></h2>
            <p className="text-lg font-medium text-white/80">Powerful ticketing and analytics from day one.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[384px] lg:w-96">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <Link to="/" className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Home
            </Link>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-on-surface">Create an account</h2>
          <p className="mt-2 text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-container transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-on-surface">Full Name</label>
                <div className="mt-1">
                  <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="Jane Doe" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-on-surface">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-secondary">
                  <span>At least 8 characters; include uppercase, numbers, and a special symbol for strong protection.</span>
                  <span className={`font-semibold ${getPasswordStrength(password) === 'strong' ? 'text-emerald-600' : getPasswordStrength(password) === 'fair' ? 'text-amber-600' : 'text-red-600'}`}>
                    {password ? `${getPasswordStrength(password).toUpperCase()} strength` : 'Enter a password'}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface">Confirm Password</label>
                <div className="mt-1">
                  <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
                </div>
              </div>


              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="terms" className="ml-2 block text-sm text-secondary">I agree to the <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link></label>
              </div>

              <div>
                <button type="submit" disabled={loading} className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-container hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50">
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
