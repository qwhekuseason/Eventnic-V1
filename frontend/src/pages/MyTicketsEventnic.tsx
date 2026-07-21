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
            admitsCount: tier?.admitsCount || 1,
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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-xxl">
      <header className="flex flex-col gap-6 md:flex-row md:items-end justify-between mb-16">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Tickets</h1>
          <p className="font-body-md text-secondary mt-3 leading-7">View and manage your purchased event tickets with better readability and mobile-friendly layout.</p>
        </div>
        <button onClick={() => navigate('/explore')} className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
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
              <div className="grid gap-6">
                {upcoming.map((ticket, i) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-surface rounded-[20px] border border-outline-variant shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                      <div className="md:w-[260px] h-[180px] md:h-auto overflow-hidden flex-shrink-0">
                        <img src={ticket.eventImg} alt={ticket.eventName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 p-6 md:p-8 gap-6 min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-2 items-center mb-2">
                              <span className="inline-flex items-center rounded-full bg-green-100 text-emerald-700 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]">Confirmed</span>
                              <span className="text-secondary text-sm font-medium break-all">{ticket.id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <h3 className="font-headline-sm font-bold text-on-surface mb-2 break-words">{ticket.eventName}</h3>
                          </div>
                          <button onClick={() => setSelectedTicket(ticket)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                            View Ticket
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 text-secondary text-sm leading-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span>{ticket.eventDate || 'Date TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            <span>{ticket.eventLocation || 'Location TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                            <span>{ticket.tierName} {ticket.admitsCount ? `(Admits ${ticket.admitsCount})` : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            <span>{ticket.attendeeName || '1 ticket'}</span>
                          </div>
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
              <p className="text-secondary text-body-lg p-8 bg-surface rounded-[20px] border border-outline-variant text-center">No past tickets found.</p>
            ) : (
              <div className="grid gap-6">
                {past.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-surface-container-low rounded-[20px] border border-outline-variant shadow-sm overflow-hidden opacity-90"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                      <div className="md:w-[240px] h-[160px] md:h-auto overflow-hidden flex-shrink-0 grayscale">
                        <img src={ticket.eventImg} alt={ticket.eventName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-6 md:p-8 gap-4 min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-2 items-center mb-2">
                              <span className="inline-flex items-center rounded-full bg-surface-container-highest text-secondary px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]">
                                {ticket.status.replace('_', ' ')}
                              </span>
                              <span className="text-secondary text-sm font-medium break-all">{ticket.id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <h3 className="font-headline-sm font-bold text-on-surface mb-1 break-words">{ticket.eventName}</h3>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 text-secondary text-sm leading-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span>{ticket.eventDate || 'Date TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            <span>{ticket.eventLocation || 'Location TBA'}</span>
                          </div>
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

              <div className="bg-white p-6 rounded-2xl mx-auto w-full max-w-[320px] mb-10 flex items-center justify-center border border-outline-variant shadow-sm">
                <QRCodeSVG 
                  value={selectedTicket.id} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-3">
                <p className="font-label-md text-secondary">TICKET ID</p>
                <p className="font-headline-md font-mono font-bold tracking-wider text-on-surface bg-surface-container py-3 px-4 rounded-xl break-all">
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
