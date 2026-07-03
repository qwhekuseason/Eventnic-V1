// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';

export default function ForgotPasswordEventnic() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-tertiary/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[448px] mx-auto px-md"
      >
        <div className="bg-surface rounded-[24px] border border-outline-variant shadow-xl p-xl md:p-xxl">
          <div className="text-center mb-xl">
            <Link to="/" className="inline-block mb-lg">
              <Logo />
            </Link>
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-primary text-[32px]">lock_reset</span>
            </div>
            <h1 className="font-display text-[28px] text-on-surface mb-xs">Forgot your password?</h1>
            <p className="text-secondary font-body-md">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form className="space-y-lg" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
            <div className="space-y-xs">
              <label htmlFor="reset-email" className="font-label-md text-on-surface">Email address</label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full h-12 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gradient-premium text-white rounded-xl font-bold font-label-md shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-xl text-center">
            <Link to="/login" className="text-primary font-label-md hover:underline flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
