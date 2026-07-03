import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';
import { QRCodeSVG } from 'qrcode.react';

export default function MyTicketsEventnic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const db = getFirestore(app);

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchTickets = async () => {
      try {
        const q = query(collection(db, 'tickets'), where('userId', '==', user.id));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => doc.data());
        
        // Enrich with event data
        const enriched: any[] = fetched.map(t => {
          const evt = events.find(e => e.id === t.eventId);
          const tier = evt?.ticketTiers?.find((tier: any) => tier.id === t.tierId);
          return {
            ...t,
            eventName: evt?.title || 'Unknown Event',
            eventDate: evt?.date || '',
            eventLocation: evt?.location || '',
            eventImg: evt?.coverImage || '/images/default-event.png',
            tierName: tier?.name || 'General Admission',
          };
        });
        
        // Sort newest first
        enriched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setTickets(enriched);
      } catch (e) {
        console.error('Failed to fetch tickets:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user, events, db]);

  const upcoming = tickets.filter(t => t.status === 'valid');
  const past = tickets.filter(t => t.status !== 'valid'); // checked_in or cancelled

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xxl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Tickets</h1>
          <p className="font-body-md text-secondary mt-xs">View and manage your purchased event tickets.</p>
        </div>
        <button onClick={() => navigate('/explore')} className="flex items-center justify-center gap-sm bg-primary text-on-primary px-xl h-[48px] rounded-xl font-bold shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-label-md">Browse Events</span>
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-xxl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Upcoming Tickets */}
          <section className="mb-xxl">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">event_upcoming</span> Upcoming ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-secondary text-body-lg p-xl bg-surface rounded-[20px] border border-outline-variant text-center">You have no upcoming tickets.</p>
            ) : (
              <div className="space-y-lg">
                {upcoming.map((ticket, i) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-surface rounded-[20px] border border-outline-variant shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-[240px] h-[180px] md:h-auto overflow-hidden flex-shrink-0">
                        <img src={ticket.eventImg} alt={ticket.eventName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow p-xl flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
                        <div className="flex-grow">
                          <div className="flex items-center gap-sm mb-sm">
                            <span className="px-sm py-xs rounded-full bg-green-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-label-sm text-label-sm border border-emerald-500/30">Confirmed</span>
                            <span className="text-secondary font-body-sm">{ticket.id.substring(0,8).toUpperCase()}</span>
                          </div>
                          <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{ticket.eventName}</h3>
                          <div className="flex flex-wrap gap-lg text-secondary font-body-sm">
                            <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {ticket.eventDate}</span>
                            <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">location_on</span> {ticket.eventLocation}</span>
                            <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">confirmation_number</span> {ticket.tierName}</span>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-sm flex-shrink-0">
                          <button onClick={() => setSelectedTicket(ticket)} className="px-lg py-sm bg-primary text-on-primary rounded-xl font-label-md font-bold hover:opacity-90 transition-all flex items-center gap-xs cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">qr_code_2</span> View Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Past/Used Tickets */}
          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">history</span> Past/Checked-In ({past.length})
            </h2>
            {past.length === 0 ? (
              <p className="text-secondary text-body-lg p-xl bg-surface rounded-[20px] border border-outline-variant text-center">No past tickets found.</p>
            ) : (
              <div className="space-y-lg">
                {past.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-surface-container-low rounded-[20px] border border-outline-variant shadow-sm overflow-hidden opacity-80"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-[200px] h-[140px] md:h-auto overflow-hidden flex-shrink-0 grayscale">
                        <img src={ticket.eventImg} alt={ticket.eventName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow p-xl flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
                        <div>
                          <div className="flex items-center gap-sm mb-sm">
                            <span className="px-sm py-xs rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm uppercase">{ticket.status.replace('_', ' ')}</span>
                            <span className="text-secondary font-body-sm">{ticket.id.substring(0,8).toUpperCase()}</span>
                          </div>
                          <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{ticket.eventName}</h3>
                          <p className="text-secondary font-body-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {ticket.eventDate}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface p-xl rounded-[24px] shadow-2xl max-w-sm w-full relative"
            >
              <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="text-center mt-sm mb-xl">
                <h3 className="font-headline-sm font-bold text-on-surface">{selectedTicket.eventName}</h3>
                <p className="text-secondary font-body-md mt-xs">{selectedTicket.tierName}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl mx-auto w-fit mb-xl flex items-center justify-center border border-outline-variant shadow-sm">
                <QRCodeSVG 
                  value={selectedTicket.id} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="font-label-md text-secondary">TICKET ID</p>
                <p className="font-headline-md font-mono font-bold tracking-wider text-on-surface bg-surface-container py-sm rounded-lg">
                  {selectedTicket.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              
              <p className="text-center text-body-sm text-secondary mt-xl">
                Please present this QR code at the entrance for scanning.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
