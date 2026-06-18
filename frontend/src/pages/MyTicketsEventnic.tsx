// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TICKETS = [
  {
    id: 'TKT-20261015-001',
    event: 'Global Tech Summit 2026',
    date: 'Oct 15, 2026 · 9:00 AM',
    location: 'San Francisco, CA',
    type: 'VIP Pass',
    qty: 2,
    status: 'upcoming',
    img: '/images/stitch-9bf3cc8257fe8d98.png',
  },
  {
    id: 'TKT-20261102-003',
    event: 'Neon Nights Festival',
    date: 'Nov 02, 2026 · 6:00 PM',
    location: 'Austin, TX',
    type: 'General Admission',
    qty: 1,
    status: 'upcoming',
    img: '/images/stitch-14c25d263c930b45.png',
  },
  {
    id: 'TKT-20240815-009',
    event: 'Founders Connect Summer',
    date: 'Aug 15, 2024 · 10:00 AM',
    location: 'New York, NY',
    type: 'General Admission',
    qty: 1,
    status: 'past',
    img: '/images/stitch-d87c03b4f4503fee.png',
  },
];

export default function MyTicketsEventnic() {
  const navigate = useNavigate();
  const upcoming = TICKETS.filter(t => t.status === 'upcoming');
  const past = TICKETS.filter(t => t.status === 'past');

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

      {/* Upcoming Tickets */}
      <section className="mb-xxl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">event_upcoming</span> Upcoming ({upcoming.length})
        </h2>
        <div className="space-y-lg">
          {upcoming.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-[20px] border border-outline-variant shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[240px] h-[180px] md:h-auto overflow-hidden flex-shrink-0">
                  <img src={ticket.img} alt={ticket.event} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow p-xl flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
                  <div className="flex-grow">
                    <div className="flex items-center gap-sm mb-sm">
                      <span className="px-sm py-xs rounded-full bg-green-100 text-green-700 font-label-sm text-label-sm border border-green-200">Confirmed</span>
                      <span className="text-secondary font-body-sm">{ticket.id}</span>
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{ticket.event}</h3>
                    <div className="flex flex-wrap gap-lg text-secondary font-body-sm">
                      <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {ticket.date}</span>
                      <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">location_on</span> {ticket.location}</span>
                      <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">confirmation_number</span> {ticket.type} × {ticket.qty}</span>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-sm flex-shrink-0">
                    <button onClick={() => toast.success('Ticket QR Code sent to your email!')} className="px-lg py-sm bg-primary text-on-primary rounded-xl font-label-md font-bold hover:opacity-90 transition-all flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span> View Ticket
                    </button>
                    <button onClick={() => toast.success('Opening maps...')} className="px-lg py-sm border border-outline-variant text-secondary rounded-xl font-label-md hover:bg-surface-container-low transition-all">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Past Tickets */}
      <section>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">history</span> Past Events ({past.length})
        </h2>
        <div className="space-y-lg">
          {past.map((ticket, i) => (
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
                  <img src={ticket.img} alt={ticket.event} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow p-xl flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
                  <div>
                    <div className="flex items-center gap-sm mb-sm">
                      <span className="px-sm py-xs rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm">Attended</span>
                      <span className="text-secondary font-body-sm">{ticket.id}</span>
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{ticket.event}</h3>
                    <p className="text-secondary font-body-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {ticket.date}</p>
                  </div>
                  <button onClick={() => toast.success('Receipt downloading...')} className="px-lg py-sm border border-outline-variant text-secondary rounded-xl font-label-md hover:bg-surface-container-high transition-all flex-shrink-0">
                    View Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
