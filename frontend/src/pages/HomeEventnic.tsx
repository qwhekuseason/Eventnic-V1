// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useEvents, eventSold, eventCapacity } from '../contexts/EventsContext';
import { useEffect, useState } from 'react';

const priceLabel = (e) => {
  if (!e.ticketTiers.length) return 'Free';
  const prices = e.ticketTiers.map((t) => Number(t.price)).filter((p) => p > 0);
  if (prices.length === 0) return 'Free';
  const min = Math.min(...prices);
  return e.ticketTiers.length > 1 ? `From $${min.toLocaleString()}` : `$${min.toLocaleString()}`;
};

export default function HomeEventnic() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { getPublishedEvents } = useEvents();
  const publishedEvents = getPublishedEvents();
  const trendingEvents = publishedEvents.slice(0, 3); // Get top 3 live events
  
  const taglines = ["online events.", "ticket sales.", "live voting.", "guest RSVPs."];
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[160px] pb-[120px] overflow-hidden bg-gradient-dark">
        {/* Abstract Background Shapes & Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          {/* Static background shapes */}
          <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[20%] w-[1000px] h-[1000px] rounded-full bg-tertiary/20 blur-[150px]" />
          <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[100px]" />
          
          {/* Floating elements hidden on slow connections */}
          {!shouldReduceMotion && (
            <>
              <motion.div animate={{ y: [0, -30, 0], rotate: [-10, 5, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[25%] left-[10%] hidden md:flex w-20 h-20 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-white text-[40px]">confirmation_number</span>
              </motion.div>
              <motion.div animate={{ y: [0, 40, 0], rotate: [15, -10, 15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] right-[10%] hidden md:flex w-24 h-24 bg-tertiary/20 backdrop-blur-md rounded-full border border-tertiary/30 items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-tertiary text-[48px]">how_to_vote</span>
              </motion.div>
              <motion.div animate={{ y: [0, -20, 0], rotate: [5, -5, 5], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[15%] right-[20%] hidden xl:flex w-16 h-16 bg-primary/30 backdrop-blur-md rounded-xl border border-primary/40 items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-white text-[32px]">local_activity</span>
              </motion.div>
              <motion.div animate={{ y: [0, -25, 0], rotate: [-5, 10, -5], scale: [0.9, 1, 0.9] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-[25%] left-[15%] hidden lg:flex w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-emerald-400 text-[32px]">qr_code_scanner</span>
              </motion.div>
              <motion.div animate={{ y: [0, 30, 0], rotate: [10, -15, 10] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[35%] right-[8%] hidden lg:flex w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-400/30 items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-amber-400 text-[28px]">campaign</span>
              </motion.div>
            </>
          )}
        </div>

        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-4xl mx-auto">
            <Link to="/legal/affiliate-terms" className="inline-block border border-white/20 rounded-full px-4 py-1 text-sm mb-lg backdrop-blur-sm text-white bg-white/5 hover:bg-white/10 transition-colors">
              Share Eventnic with other organizers and earn rewards! 🚀
            </Link>
            
            <h1 className="font-display text-[56px] md:text-[80px] leading-[1.1] text-white tracking-tight mb-md">
              The Easy Way to manage <br className="hidden md:block"/> 
              <motion.span 
                key={taglineIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-transparent bg-clip-text text-gradient-animated"
              >
                {taglines[taglineIndex]}
              </motion.span>
            </h1>
            <p className="font-body-lg text-[20px] text-white/80 max-w-2xl mx-auto mb-xl">
              Organizing and managing online events is easy with us. Our platform helps you run everything smoothly in one place.
            </p>
            
            {/* Search/Action Bar */}
            <div className="glass-panel-dark max-w-2xl mx-auto rounded-full p-2 flex items-center shadow-2xl mb-xl">
              <span className="material-symbols-outlined text-white/50 ml-md mr-sm">search</span>
              <input 
                type="text" 
                placeholder="Search upcoming events..." 
                className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 font-body-md"
                onKeyDown={(e) => {
                  if(e.key === 'Enter') navigate('/explore');
                }}
              />
              <button 
                onClick={() => navigate('/create-event/basic-info')}
                className="bg-primary hover:bg-tertiary text-white px-xl py-sm rounded-full font-bold font-label-md shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap glow-primary"
              >
                Create Event
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-lg text-white/60 font-body-sm">
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-transparent bg-clip-text bg-gradient-premium leading-none mb-sm">2,500+</h3>
              <p className="text-secondary font-body-md font-medium">Events Hosted</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-transparent bg-clip-text bg-gradient-premium leading-none mb-sm">500K+</h3>
              <p className="text-secondary font-body-md font-medium">Votes Cast</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-transparent bg-clip-text bg-gradient-premium leading-none mb-sm">100K+</h3>
              <p className="text-secondary font-body-md font-medium">Tickets Sold</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h3 className="text-[48px] md:text-[64px] font-display text-transparent bg-clip-text bg-gradient-premium leading-none mb-sm">1M+</h3>
              <p className="text-secondary font-body-md font-medium">Global Reach</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-[120px] bg-white border-b border-outline-variant relative z-20">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="text-center mb-xxl">
            <h2 className="font-display text-[40px] text-on-surface leading-tight mb-md">Everything you need. <br/> <span className="text-transparent bg-clip-text bg-gradient-premium">Nothing you don't.</span></h2>
            <p className="text-secondary font-body-lg max-w-2xl mx-auto">
              Eventnic comes packed with advanced features built specifically for modern event organizers. Automate the tedious parts and focus on the experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">stars</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Nominations</h3>
              <p className="text-secondary font-body-md">Collect entries, review submissions, and publish nominees without messy manual follow-up.</p>
            </div>

            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">how_to_vote</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Live Voting</h3>
              <p className="text-secondary font-body-md">Run secure online and USSD voting with live results and a smoother participant experience.</p>
            </div>

            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">local_activity</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Ticketing</h3>
              <p className="text-secondary font-body-md">Sell tickets, manage ticket types, and keep registrations moving from launch to check-in.</p>
            </div>

            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">rsvp</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Guest RSVP</h3>
              <p className="text-secondary font-body-md">Track confirmations, manage guest lists, and send reminders without chasing attendees manually.</p>
            </div>

            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">storefront</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Marketplace</h3>
              <p className="text-secondary font-body-md">Find venues, vendors, and event services in one place to speed up event planning decisions.</p>
            </div>

            <div className="p-xl rounded-[24px] bg-surface border border-outline-variant card-hover group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-lg group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[28px]">monitoring</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-sm">Deep Analytics</h3>
              <p className="text-secondary font-body-md">Track page views, conversion rates, and revenue in real-time. Export CSV reports for your accounting team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Featured Events Grid */}
      <section className="py-[120px] relative z-20 bg-background">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-display text-[40px] text-on-surface leading-tight">Trending Live Events</h2>
              <p className="text-secondary font-body-lg mt-xs">Discover what's happening around you.</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-xs text-primary font-bold hover:gap-sm transition-all">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {trendingEvents.length === 0 ? (
            <div className="text-center py-xxl text-secondary bg-surface rounded-2xl border border-outline-variant">
              <span className="material-symbols-outlined text-[48px] mb-sm block">event_busy</span>
              <p className="font-headline-sm">No live events yet.</p>
              <p className="font-body-md mt-xs">Be the first to create one!</p>
              <button onClick={() => navigate('/create-event/basic-info')} className="mt-md bg-primary text-white px-lg py-sm rounded-full font-bold">Create Event</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {trendingEvents.map((event, i) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => navigate(`/event/${event.slug}`)}
                  className="card-hover group bg-white rounded-[24px] overflow-hidden border border-outline-variant cursor-pointer"
                >
                  <div className="h-[240px] relative overflow-hidden bg-surface-variant">
                    {event.coverImage ? (
                      <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high group-hover:scale-110 transition-transform duration-700">
                        <span className="material-symbols-outlined text-[48px] text-outline">image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                      {event.date || 'TBA'}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                      {priceLabel(event)}
                    </div>
                  </div>
                  <div className="p-lg">
                    <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                      <span className="material-symbols-outlined text-[16px]">category</span> {event.category || 'Event'}
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-secondary font-body-sm flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> {event.location || 'TBA'}
                    </p>
                    
                    {/* Event Stats row */}
                    <div className="mt-md pt-md border-t border-outline-variant flex items-center justify-between text-secondary">
                      <div className="flex items-center gap-xs text-xs font-medium">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {event.organizerName ? event.organizerName.charAt(0).toUpperCase() : 'O'}
                        </span>
                        <span>{event.organizerName || 'Organizer'}</span>
                      </div>
                      {event.ticketTiers.length > 0 && (
                        <div className="text-xs font-medium flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          {eventSold(event).toLocaleString()} attending
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[120px] px-margin bg-background">
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
              <button onClick={() => navigate('/create-event/basic-info')} className="bg-white text-primary font-bold font-headline-sm px-[40px] py-[16px] rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto glow-primary">
                Get Started Free
              </button>
              <button onClick={() => navigate('/contact')} className="glass-panel text-white font-bold font-headline-sm px-[40px] py-[16px] rounded-full hover:bg-white/10 transition-all w-full sm:w-auto border border-white/30">
                Talk to Sales
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
