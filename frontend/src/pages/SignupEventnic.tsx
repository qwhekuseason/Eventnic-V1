import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth, roleHomePath } from '../contexts/AuthContext';

export default function SignupEventnic() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Self-service sign-ups always get the standard organizer role. Elevated
    // roles (admin, nominee) are provisioned server-side, never self-selected.
    const role = 'ORGANIZER' as const;
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'New User',
      email: email,
      role: role,
    };

    login(user);
    navigate(roleHomePath(role));
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
                  <input id="password" name="password" type="password" autoComplete="new-password" required className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
                </div>
              </div>

              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="terms" className="ml-2 block text-sm text-secondary">I agree to the <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link></label>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-container hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
