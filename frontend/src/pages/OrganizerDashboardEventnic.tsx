// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, eventSold, eventCapacity, eventSoldPct } from '../contexts/EventsContext';
import { useNominations } from '../contexts/NominationsContext';
import { motion } from 'framer-motion';
import EventDetailsModal from '../components/EventDetailsModal';

const money = (n: number) => 'GH₵ ' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function StatusBadge({ event }) {
  if (event.status === 'pending') return <span className="px-sm py-xs rounded-full bg-amber-100 text-amber-600 dark:text-amber-400 font-label-sm text-label-sm border border-amber-500/30 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pending</span>;
  if (event.status === 'draft') return <span className="px-sm py-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-outline-variant flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-outline"></span> Draft</span>;
  if (event.status === 'rejected') return <span className="px-sm py-xs rounded-full bg-red-100 text-on-error-container font-label-sm text-label-sm border border-error/30 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected</span>;
  const pct = eventSoldPct(event);
  if (pct >= 90) return <span className="px-sm py-xs rounded-full bg-red-100 text-on-error-container font-label-sm text-label-sm border border-error/30 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> Selling Fast</span>;
  return <span className="px-sm py-xs rounded-full bg-emerald-100 text-emerald-700 font-label-sm text-label-sm border border-emerald-200 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> On Sale</span>;
}

export default function OrganizerDashboardEventnic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { getEventsByOrganizer, organizerTotals } = useEvents();

  const { nominations } = useNominations();
  const email = user?.email || '';
  const events = getEventsByOrganizer(email);
  const totals = organizerTotals(email);
  const isPending = user?.verificationStatus === 'PENDING';
  const isSuspended = user?.status === 'suspended';
  const totalPendingNominations = events.reduce((acc, e) => acc + nominations.filter(n => n.eventId === e.id && n.status === 'pending').length, 0);

  return (
    <main className="min-h-screen bg-background pt-[100px] pb-xxl">
      {/* Welcome Banner */}
      <div className="max-w-container-max mx-auto px-margin mb-xl">
        {isSuspended && (
          <div className="mb-lg p-md bg-error-container border border-error/30 rounded-xl flex items-start gap-md">
            <span className="material-symbols-outlined text-error mt-1">block</span>
            <div>
              <h3 className="font-display text-lg text-red-900">Account Suspended</h3>
              <p className="text-red-800 font-body-sm mt-1">Your account has been suspended. Contact support or platform administration to restore access.</p>
            </div>
          </div>
        )}
        {isPending && !isSuspended && (
          <div className="mb-lg p-md bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-md">
            <span className="material-symbols-outlined text-amber-600 mt-1">pending_actions</span>
            <div>
              <h3 className="font-display text-lg text-amber-900">Verification Pending</h3>
              <p className="text-amber-800 font-body-sm mt-1">Your organizer account is currently pending administrative review. You will not be able to create or publish events until you are verified. This usually takes 24-48 hours.</p>
            </div>
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-premium rounded-3xl p-xl shadow-lg relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div>
              <h1 className="font-display text-[40px] leading-tight mb-xs">Welcome back, {user?.name || 'Organizer'}!</h1>
              <p className="font-body-lg text-white/80 max-w-2xl">Manage your events, track real-time sales, and connect with your attendees all in one place.</p>
            </div>
            <div className="flex flex-wrap gap-sm">
              <Link to="/organizer/nominations" className="flex items-center justify-center gap-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-md h-[48px] rounded-xl font-bold transition-colors backdrop-blur-md relative">
                <span className="material-symbols-outlined text-[20px]">person_add</span> Nominations
                {totalPendingNominations > 0 && <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalPendingNominations}</span>}
              </Link>
              <Link to="/organizer/scanner" className="flex items-center justify-center gap-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-md h-[48px] rounded-xl font-bold transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span> Scanner
              </Link>
              <Link to="/organizer/broadcasts" className="flex items-center justify-center gap-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-md h-[48px] rounded-xl font-bold transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">mail</span> Broadcast
              </Link>
              <Link to="/organizer/transactions" className="flex items-center justify-center gap-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-md h-[48px] rounded-xl font-bold transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span> Transactions
              </Link>
              <button onClick={() => navigate('/settings/payout')} className="flex items-center justify-center gap-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-md h-[48px] rounded-xl font-bold transition-all hover:shadow-md backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span> Payout Settings
              </button>
              <button onClick={() => navigate('/create-event/basic-info')} disabled={isPending || isSuspended} className="flex items-center justify-center gap-xs bg-surface text-primary hover:bg-surface-container-lowest px-lg h-[48px] rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-[20px]">add</span> Create Event
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-container-max mx-auto px-margin">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-surface border border-outline-variant p-lg rounded-3xl shadow-sm hover:shadow-md transition-shadow card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-xl group-hover:bg-tertiary/20 transition-colors"></div>
            <div className="flex items-center justify-between mb-md relative z-10">
              <span className="text-secondary font-label-md uppercase tracking-wider">Total Revenue</span>
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary"><span className="material-symbols-outlined">payments</span></div>
            </div>
            <span className="font-display text-[40px] text-on-surface relative z-10">{money(totals.revenue)}</span>
            <div className="flex items-center gap-xs mt-sm text-secondary font-body-sm relative z-10 bg-surface-container px-sm py-1 rounded-full w-fit">Across {totals.totalEvents} event{totals.totalEvents === 1 ? '' : 's'}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-surface border border-outline-variant p-lg rounded-3xl shadow-sm hover:shadow-md transition-shadow card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="flex items-center justify-between mb-md relative z-10">
              <span className="text-secondary font-label-md uppercase tracking-wider">Tickets Sold</span>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">confirmation_number</span></div>
            </div>
            <span className="font-display text-[40px] text-on-surface relative z-10">{totals.ticketsSold.toLocaleString()}</span>
            <div className="flex items-center gap-xs mt-sm text-secondary font-body-sm relative z-10 bg-surface-container px-sm py-1 rounded-full w-fit">Total across all tiers</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-surface border border-outline-variant p-lg rounded-3xl shadow-sm hover:shadow-md transition-shadow card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="flex items-center justify-between mb-md relative z-10">
              <span className="text-secondary font-label-md uppercase tracking-wider">Active Events</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><span className="material-symbols-outlined">event_available</span></div>
            </div>
            <span className="font-display text-[40px] text-on-surface relative z-10">{totals.activeEvents}</span>
            <div className="flex items-center gap-xs mt-sm text-secondary font-body-sm relative z-10 bg-surface-container px-sm py-1 rounded-full w-fit">Published &amp; on sale</div>
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-surface border border-outline-variant rounded-3xl shadow-sm overflow-hidden">
          <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-display text-[28px] text-on-surface">Your Events</h2>
            <button 
              onClick={() => navigate('/create-event/basic-info')} 
              disabled={isPending || isSuspended}
              className="text-primary font-bold font-label-md hover:underline flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> New
            </button>
          </div>

          {events.length === 0 ? (
            <div className="p-xl md:p-[80px] flex flex-col md:flex-row items-center justify-between gap-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-lg">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[48px]">event</span>
                </div>
                <div>
                  <h3 className="font-display text-[32px] text-on-surface mb-xs">No events yet</h3>
                  <p className="text-secondary font-body-lg max-w-[512px]">Create your first event to start selling tickets, managing RSVPs, and running voting.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/create-event/basic-info')} 
                disabled={isPending}
                className="shrink-0 bg-primary text-white px-xl py-md rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-outline-variant bg-surface-container-lowest">
                    <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Event Details</th>
                    <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Date &amp; Time</th>
                    <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Sales Progress</th>
                    <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Nominations</th>
                    <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Status</th>
                    <th className="px-xl py-md"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {events.map((e) => {
                    const sold = eventSold(e);
                    const cap = eventCapacity(e);
                    const pct = eventSoldPct(e);
                    return (
                      <tr key={e.id} onClick={() => setSelectedEvent(e)} className="hover:bg-surface-container-lowest cursor-pointer transition-colors group">
                        <td className="px-xl py-lg">
                          <div className="flex items-center gap-md">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-variant flex items-center justify-center shadow-sm">
                              {e.coverImage ? <img alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={e.coverImage} /> : <span className="material-symbols-outlined text-secondary">image</span>}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{e.title}</div>
                              <div className="font-body-sm text-secondary flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[14px]">location_on</span> {e.location || 'Location TBD'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-xl py-lg">
                          <div className="font-bold text-on-surface">{e.date || 'TBD'}</div>
                          <div className="font-body-sm text-secondary">{e.time || ''}</div>
                        </td>
                        <td className="px-xl py-lg">
                          <div className="flex flex-col gap-xs w-48">
                            <div className="flex justify-between font-label-sm">
                              <span className="text-secondary font-medium">{sold.toLocaleString()} / {cap.toLocaleString()}</span>
                              <span className={`font-bold ${pct >= 90 ? 'text-error' : 'text-primary'}`}>{pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct >= 90 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-xl py-lg">
                          {(() => {
                            const nomCount = nominations.filter(n => n.eventId === e.id && n.status === 'pending').length;
                            return nomCount > 0 ? (
                              <span className="bg-error text-white text-xs font-bold px-2.5 py-1 rounded-full">{nomCount} pending</span>
                            ) : (
                              <span className="text-secondary text-xs">—</span>
                            );
                          })()}
                        </td>
                        <td className="px-xl py-lg"><StatusBadge event={e} /></td>
                        <td className="px-xl py-lg text-right" onClick={(ev) => ev.stopPropagation()}>
                          <div className="flex items-center justify-end gap-xs">
                            <button onClick={() => setSelectedEvent(e)} className="bg-surface-container-high text-on-surface hover:bg-surface-container border border-outline-variant px-md py-xs rounded-full font-label-sm font-bold transition-all flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px]">visibility</span> View Details
                            </button>
                            <button onClick={() => navigate(`/event-analytics?event=${e.id}`)} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-md py-xs rounded-full font-label-sm font-bold transition-all flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px]">analytics</span> Analytics
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  );
}
