import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth, resolveRole, roleHomePath } from '../contexts/AuthContext';

export default function LoginEventnic() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Role is resolved on the "server" from the credentials, not picked in the UI.
    const role = resolveRole(email);
    const defaultNames: Record<string, string> = {
      ADMIN: 'System Admin',
      ORGANIZER: 'Markus DJ',
      NOMINEE: 'Sarah Nominee',
    };
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: defaultNames[role] ?? (email.split('@')[0] || 'Guest'),
      email: email,
      role: role,
    };

    login(user);
    navigate(roleHomePath(role));
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
                  <input id="password" name="password" type="password" required placeholder="••••••••" className="block w-full appearance-none rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" />
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
                <button type="submit" className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-container hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-6 text-xs text-secondary text-center leading-relaxed">
              Demo accounts (any password): <span className="font-medium text-on-surface">admin@eventnic.com</span>,{' '}
              <span className="font-medium text-on-surface">organizer@eventnic.com</span>,{' '}
              <span className="font-medium text-on-surface">nominee@eventnic.com</span>.
              <br />Your access level is determined by your account, not selected here.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-dark overflow-hidden">
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
