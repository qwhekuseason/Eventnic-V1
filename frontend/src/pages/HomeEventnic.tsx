// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export default function HomeEventnic() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? {} : {
    animate: { 
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.5, 0.3]
    },
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[120px] overflow-hidden bg-gradient-dark">
        {/* Abstract Background Shapes & Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          {/* Static background shapes - no animation for performance */}
          <div 
            className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]" 
          />
          <div 
            className="absolute top-[20%] -right-[20%] w-[1000px] h-[1000px] rounded-full bg-tertiary/20 blur-[150px]" 
          />
          
          {/* Floating elements hidden on slow connections */}
          {!shouldReduceMotion && (
            <>
              {/* Floating Ticket 1 */}
              <motion.div
                animate={{ y: [0, -30, 0], rotate: [-10, 5, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[25%] left-[10%] hidden md:flex w-20 h-20 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-white text-[40px]">confirmation_number</span>
              </motion.div>

              {/* Floating Vote */}
              <motion.div
                animate={{ y: [0, 40, 0], rotate: [15, -10, 15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] right-[10%] hidden md:flex w-24 h-24 bg-tertiary/20 backdrop-blur-md rounded-full border border-tertiary/30 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-tertiary text-[48px]">how_to_vote</span>
              </motion.div>

              {/* Floating Ticket 2 */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [5, -5, 5], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[15%] right-[20%] hidden xl:flex w-16 h-16 bg-primary/30 backdrop-blur-md rounded-xl border border-primary/40 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-white text-[32px]">local_activity</span>
              </motion.div>

              {/* Floating Scanner (Greenish) */}
              <motion.div
                animate={{ y: [0, -25, 0], rotate: [-5, 10, -5], scale: [0.9, 1, 0.9] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[25%] left-[15%] hidden lg:flex w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-emerald-400 text-[32px]">qr_code_scanner</span>
              </motion.div>

              {/* Floating Broadcast (Yellowish) */}
              <motion.div
                animate={{ y: [0, 30, 0], rotate: [10, -15, 10] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[35%] right-[8%] hidden lg:flex w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-400/30 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-amber-400 text-[28px]">campaign</span>
              </motion.div>

              {/* Floating Group (Pinkish) */}
              <motion.div
                animate={{ y: [0, -35, 0], rotate: [-15, 5, -15] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                className="absolute top-[10%] left-[25%] hidden xl:flex w-14 h-14 bg-fuchsia-500/20 backdrop-blur-md rounded-xl border border-fuchsia-400/30 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-fuchsia-400 text-[28px]">groups</span>
              </motion.div>

              {/* Floating Analytics (Blueish) */}
              <motion.div
                animate={{ y: [0, 25, 0], rotate: [5, -5, 5], scale: [1, 1.05, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-[15%] left-[30%] hidden xl:flex w-12 h-12 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-400/30 items-center justify-center shadow-2xl"
              >
                <span className="material-symbols-outlined text-cyan-400 text-[24px]">monitoring</span>
              </motion.div>

              {/* Floating Eventnic Logo (Middle/Center) */}
              <motion.div
                animate={{ y: [0, -40, 0], scale: [0.95, 1.05, 0.95], rotate: [-2, 2, -2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-[40%] right-[40%] hidden lg:flex opacity-20 pointer-events-none"
              >
                <img src="/eventnic.png" alt="" className="w-32 h-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </motion.div>
            </>
          )}
        </div>

        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="font-display text-[56px] md:text-[80px] leading-[1.1] text-white tracking-tight mb-md">
              Create events that <br className="hidden md:block"/> <span className="text-tertiary bg-clip-text text-transparent bg-gradient-premium">leave a mark.</span>
            </h1>
            <p className="font-body-lg text-[20px] text-white/80 max-w-2xl mx-auto mb-xl">
              The premier platform for high-end ticketing, frictionless check-ins, and deep analytics. Manage your events like never before.
            </p>
            
            {/* Search/Action Bar */}
            <div className="glass-panel-dark max-w-2xl mx-auto rounded-full p-2 flex items-center shadow-2xl mb-xl">
              <span className="material-symbols-outlined text-white/50 ml-md mr-sm">search</span>
              <input 
                type="text" 
                placeholder="Search upcoming events..." 
                className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 font-body-md"
              />
              <button 
                onClick={() => navigate('/create-event/basic-info')}
                className="bg-gradient-premium text-white px-xl py-sm rounded-full font-bold font-label-md shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                Create Event
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-lg text-white/60 font-body-sm">
              <div className="flex items-center gap-xs"><span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span> 0% Setup Fees</div>
              <div className="flex items-center gap-xs"><span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span> Next-Day Payouts</div>
              <div className="flex items-center gap-xs"><span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span> 24/7 Support</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-[80px] bg-surface-container-lowest border-b border-outline-variant relative z-20">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-primary leading-none mb-sm">50K+</h3>
              <p className="text-primary/80 font-body-md font-medium">Events Hosted</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-primary leading-none mb-sm">12M+</h3>
              <p className="text-primary/80 font-body-md font-medium">Tickets Sold</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-primary leading-none mb-sm">98%</h3>
              <p className="text-primary/80 font-body-md font-medium">Customer Satisfaction</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-primary leading-none mb-sm">140+</h3>
              <p className="text-primary/80 font-body-md font-medium">Countries</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-[120px] bg-white border-b border-outline-variant relative z-20">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="text-center mb-xxl">
            <h2 className="font-display text-[40px] text-on-surface leading-tight mb-md">Everything you need. <br/> <span className="text-primary">Nothing you don't.</span></h2>
            <p className="text-secondary font-body-lg max-w-2xl mx-auto">
              Eventnic comes packed with advanced features built specifically for modern event organizers. Automate the tedious parts and focus on the experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
            {/* Feature 1 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">how_to_vote</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Voting & Nominees</h3>
              <p className="text-secondary font-body-md">Run public polls or award ceremonies. Let attendees vote for their favorite nominees directly from your event page.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">contact_mail</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">RSVP & Guest Lists</h3>
              <p className="text-secondary font-body-md">Manage exclusive VIP lists or simple free RSVPs. Keep track of exactly who is coming without the hassle of paid ticketing.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Check-in Scanner</h3>
              <p className="text-secondary font-body-md">Turn any smartphone into a powerful ticket scanner. Prevent duplicates and keep the line moving fast at the door.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Email Broadcasts</h3>
              <p className="text-secondary font-body-md">Send updates, schedules, and reminders directly to your registered attendees with our built-in email marketing tools.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">currency_exchange</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Automated Refunds</h3>
              <p className="text-secondary font-body-md">No more manual bank transfers. Process full or partial refunds instantly with a single click from your dashboard.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Deep Analytics</h3>
              <p className="text-secondary font-body-md">Track page views, conversion rates, and revenue in real-time. Export CSV reports for your accounting team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="py-[120px] relative z-20 bg-background">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-display text-[40px] text-on-surface leading-tight">Trending Events</h2>
              <p className="text-secondary font-body-lg mt-xs">Discover what's happening around you.</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-xs text-primary font-bold hover:gap-sm transition-all">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
            {/* Event Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-[240px] relative overflow-hidden">
                <img src="/images/stitch-9bf3cc8257fe8d98.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Tech Conference" />
                <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                  Oct 15
                </div>
                <div className="absolute top-4 right-4 bg-white text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                  $299
                </div>
              </div>
              <div className="p-lg">
                <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                  <span className="material-symbols-outlined text-[16px]">category</span> Technology
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">Global Tech Summit 2026</h3>
                <p className="text-secondary font-body-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">location_on</span> San Francisco, CA</p>
              </div>
            </motion.div>

            {/* Event Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-[240px] relative overflow-hidden">
                <img src="/images/stitch-14c25d263c930b45.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Music Festival" />
                <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                  Nov 02
                </div>
                <div className="absolute top-4 right-4 bg-white text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                  From $89
                </div>
              </div>
              <div className="p-lg">
                <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                  <span className="material-symbols-outlined text-[16px]">music_note</span> Festival
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">Neon Nights Festival</h3>
                <p className="text-secondary font-body-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">location_on</span> Austin, TX</p>
              </div>
            </motion.div>

            {/* Event Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-[240px] relative overflow-hidden">
                <img src="/images/stitch-d87c03b4f4503fee.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Networking Event" />
                <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                  Dec 12
                </div>
                <div className="absolute top-4 right-4 bg-white text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                  Free
                </div>
              </div>
              <div className="p-lg">
                <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                  <span className="material-symbols-outlined text-[16px]">groups</span> Networking
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">Founders Connect Winter</h3>
                <p className="text-secondary font-body-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">location_on</span> New York, NY</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[120px] px-margin">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-container-max mx-auto rounded-[40px] bg-gradient-dark p-xl md:p-[100px] text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative circles */}
          <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[80px]"></div>
          <div className="absolute -bottom-[50%] -right-[10%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[80px]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-[48px] text-white mb-lg leading-tight">Host your next big idea with Eventnic.</h2>
            <p className="text-white/80 font-body-lg mb-xl">
              Join thousands of organizers who have upgraded their event management experience. From ticket sales to final payout, we handle the heavy lifting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
              <button onClick={() => navigate('/create-event/basic-info')} className="bg-white text-primary font-bold font-headline-sm px-[40px] py-[16px] rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                Get Started Free
              </button>
              <button onClick={() => navigate('/explore')} className="glass-panel text-white font-bold font-headline-sm px-[40px] py-[16px] rounded-full hover:bg-white/10 transition-all w-full sm:w-auto">
                Talk to Sales
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
