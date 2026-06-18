// @ts-nocheck
import { useAuth } from '../../contexts/AuthContext';
import { useEvents, eventRevenue } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const money = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events, platformTotals, getPendingEvents, approveEvent, rejectEvent } = useEvents();

  const totals = platformTotals();
  const pending = getPendingEvents();

  // Revenue-by-event chart (top published events).
  const published = events.filter((e) => e.status === 'published');
  const byRevenue = [...published].sort((a, b) => eventRevenue(b) - eventRevenue(a)).slice(0, 6);
  const maxRev = Math.max(1, ...byRevenue.map((e) => eventRevenue(e)));

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-[40px] text-on-surface leading-tight">Admin Dashboard</h1>
            <p className="text-secondary font-body-lg">Welcome back, {user?.name}. Platform overview across all organizers.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex gap-sm flex-wrap">
            <Link to="/admin/users" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">group</span> Users
            </Link>
            <Link to="/admin/moderation" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">gavel</span> Moderation
            </Link>
            <Link to="/admin/transactions" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span> Transactions
            </Link>
          </motion.div>
        </div>

        {/* Top Stats - Glassmorphism style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }} className="relative rounded-3xl overflow-hidden bg-surface border border-outline-variant shadow-sm hover:shadow-lg transition-all card-hover group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="relative p-lg flex flex-col">
              <span className="text-secondary font-label-md uppercase tracking-wider mb-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">event</span> Total Events
              </span>
              <span className="font-display text-[36px] text-on-surface">{totals.totalEvents}</span>
              <span className="text-secondary font-body-sm mt-xs font-medium bg-surface-container px-sm py-1 rounded-full w-fit">
                {totals.activeEvents} published
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="relative rounded-3xl overflow-hidden bg-surface border border-outline-variant shadow-sm hover:shadow-lg transition-all card-hover group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="relative p-lg flex flex-col">
              <span className="text-secondary font-label-md uppercase tracking-wider mb-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">confirmation_number</span> Tickets Sold
              </span>
              <span className="font-display text-[36px] text-on-surface">{totals.ticketsSold.toLocaleString()}</span>
              <span className="text-emerald-600 font-body-sm mt-xs font-medium bg-emerald-50 px-sm py-1 rounded-full w-fit">
                across all events
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="relative rounded-3xl overflow-hidden bg-surface border border-outline-variant shadow-sm hover:shadow-lg transition-all card-hover group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-xl group-hover:bg-tertiary/20 transition-colors"></div>
            <div className="relative p-lg flex flex-col">
              <span className="text-secondary font-label-md uppercase tracking-wider mb-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-tertiary">account_balance</span> Revenue
              </span>
              <span className="font-display text-[36px] text-on-surface">{money(totals.revenue)}</span>
              <span className="text-tertiary font-body-sm mt-xs font-medium bg-tertiary/10 px-sm py-1 rounded-full w-fit">
                gross ticket sales
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="relative rounded-3xl overflow-hidden bg-surface border border-outline-variant shadow-sm hover:shadow-lg transition-all card-hover group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl transition-colors ${totals.pending > 0 ? 'bg-error/10 group-hover:bg-error/20' : 'bg-surface-variant'}`}></div>
            <div className="relative p-lg flex flex-col">
              <span className="text-secondary font-label-md uppercase tracking-wider mb-xs flex items-center gap-xs">
                <span className={`material-symbols-outlined text-[18px] ${totals.pending > 0 ? 'text-error' : 'text-secondary'}`}>gavel</span> Pending
              </span>
              <span className={`font-display text-[36px] ${totals.pending > 0 ? 'text-error' : 'text-on-surface'}`}>{totals.pending}</span>
              <span className={`font-body-sm mt-xs font-medium px-sm py-1 rounded-full w-fit ${totals.pending > 0 ? 'text-error bg-error/10' : 'text-secondary bg-surface-container'}`}>
                {totals.pending > 0 ? 'Action required' : 'All clear'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2 space-y-lg">
            {/* Revenue chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-surface rounded-3xl border border-outline-variant shadow-sm p-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="font-display text-[24px] text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">bar_chart</span>
                Revenue by Event
              </h2>
              {byRevenue.length === 0 ? (
                <div className="py-xl text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-sm">analytics</span>
                  <p className="text-secondary font-body-lg">No published events yet to analyze.</p>
                </div>
              ) : (
                <div className="space-y-lg relative z-10">
                  {byRevenue.map((e, idx) => {
                    const rev = eventRevenue(e);
                    const pct = Math.round((rev / maxRev) * 100);
                    return (
                      <div key={e.id} className="space-y-sm group">
                        <div className="flex justify-between items-end">
                          <span className="text-on-surface font-label-md truncate pr-md flex items-center gap-xs">
                            <span className="text-secondary font-bold text-xs">{idx + 1}.</span> {e.title}
                          </span>
                          <span className="text-primary font-bold">{money(rev)}</span>
                        </div>
                        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 w-full h-full animate-shimmer opacity-30"></div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Pending approvals */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <div className="flex items-center justify-between mb-sm mt-xl">
                <h2 className="font-display text-[24px] text-on-surface">Events Pending Approval</h2>
                {pending.length > 0 && <span className="bg-error text-white px-sm py-xs rounded-full font-bold text-xs">{pending.length} new</span>}
              </div>
              <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
                {pending.length === 0 ? (
                  <div className="p-xxl text-center text-secondary font-body-lg flex flex-col items-center">
                    <span className="material-symbols-outlined text-[48px] text-outline mb-sm">task_alt</span>
                    No events waiting for review. You're all caught up! 🎉
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant">
                    {pending.map((e) => (
                      <div key={e.id} className="p-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md hover:bg-surface-container-lowest transition-colors">
                        <div className="flex items-center gap-md">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-variant flex items-center justify-center shrink-0 shadow-sm">
                            {e.coverImage ? <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-secondary">image</span>}
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface font-headline-sm">{e.title}</h4>
                            <div className="flex items-center gap-xs mt-xs text-secondary font-body-sm">
                              <span className="material-symbols-outlined text-[16px]">person</span> {e.organizerName}
                              <span className="mx-xs">•</span>
                              <span className="material-symbols-outlined text-[16px]">category</span> {e.category}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-sm items-center w-full sm:w-auto justify-end mt-sm sm:mt-0 border-t sm:border-t-0 border-outline-variant pt-sm sm:pt-0">
                          <button onClick={() => rejectEvent(e.id)} className="text-error font-bold font-label-md px-md py-sm rounded-lg hover:bg-error/10 transition-colors">Reject</button>
                          <button onClick={() => approveEvent(e.id)} className="bg-primary text-white px-lg py-sm rounded-xl font-bold font-label-md hover:bg-primary-container shadow-md transition-all active:scale-95">Approve Live</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-lg">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <h2 className="font-display text-[24px] text-on-surface mb-sm">System Status</h2>
              
              <div className="space-y-md">
                {totals.pending > 0 && (
                  <div className="bg-error/10 border border-error/20 text-on-surface rounded-2xl p-md shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-error"></div>
                    <div className="flex items-center gap-sm font-bold mb-xs text-error">
                      <span className="material-symbols-outlined">notification_important</span> Action Required
                    </div>
                    <p className="font-body-sm text-secondary">There are <strong className="text-on-surface">{totals.pending} events</strong> in the moderation queue waiting for your approval.</p>
                  </div>
                )}
                
                <div className="bg-surface rounded-2xl border border-outline-variant p-md shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
                  <div className="flex items-center gap-sm font-bold mb-xs text-on-surface">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span> Platform Healthy
                  </div>
                  <p className="font-body-sm text-secondary">All systems operational. The platform is currently tracking <strong className="text-on-surface">{totals.activeEvents} live events</strong> and managing <strong className="text-on-surface">{money(totals.revenue)}</strong> in gross sales.</p>
                </div>
                
                <div className="bg-surface rounded-2xl border border-outline-variant p-md shadow-sm">
                  <h3 className="font-bold text-on-surface mb-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">quick_reference_all</span> Quick Links</h3>
                  <div className="flex flex-col gap-xs">
                    <Link to="/admin/users" className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg text-secondary hover:text-primary transition-colors">
                      <span className="font-label-sm">Manage Users</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                    <Link to="/explore" className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg text-secondary hover:text-primary transition-colors">
                      <span className="font-label-sm">View Live Portal</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
