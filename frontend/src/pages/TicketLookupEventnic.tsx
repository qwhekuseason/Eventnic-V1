import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TicketLookupEventnic() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[80px] overflow-hidden hero-section">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[120px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-md">
              Lost Your <span className="text-tertiary">Ticket?</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[512px] mx-auto">
              No problem. Enter the email address you used to purchase, and we'll resend your tickets immediately.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-[80px]">
        <div className="max-w-[512px] mx-auto px-margin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface rounded-[24px] p-xl md:p-xxl border border-outline-variant shadow-xl"
          >
            {status === 'success' ? (
              <div className="text-center py-lg">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-lg">
                  <span className="material-symbols-outlined text-green-500 text-[40px]">mark_email_read</span>
                </div>
                <h2 className="font-display text-[28px] text-on-surface mb-sm">Check your inbox!</h2>
                <p className="text-secondary font-body-md mb-xl">
                  If there are any tickets associated with that email address, you'll receive an email with download links within a few minutes.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-primary font-label-md hover:underline"
                >
                  Lookup another email
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-lg">
                  <span className="material-symbols-outlined text-primary text-[32px]">search</span>
                </div>
                <h2 className="font-display text-[28px] text-center text-on-surface mb-xl">Ticket Lookup</h2>
                
                <form className="space-y-lg" onSubmit={handleSubmit}>
                  <div className="space-y-xs">
                    <label className="font-label-md text-on-surface" htmlFor="lookup-email">Email Address</label>
                    <input 
                      id="lookup-email" 
                      type="email" 
                      required 
                      placeholder="you@example.com" 
                      className="w-full h-14 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md" 
                    />
                    <p className="text-xs text-secondary mt-1">Must be the exact email used at checkout.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full h-14 bg-gradient-premium text-white rounded-xl font-bold font-label-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-sm"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        Searching...
                      </>
                    ) : (
                      'Resend Tickets'
                    )}
                  </button>
                </form>

                <div className="mt-xl pt-lg border-t border-outline-variant text-center">
                  <p className="text-secondary font-body-sm">
                    Still can't find it? Check your spam folder or <Link to="/contact" className="text-primary hover:underline">contact support</Link>.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
