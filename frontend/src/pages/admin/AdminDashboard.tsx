import { useAuth } from '../../contexts/AuthContext';
import { useEvents, eventRevenue } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h1 className="font-display text-[40px] text-on-surface leading-tight">Admin Dashboard</h1>
            <p className="text-secondary font-body-lg">Welcome back, {user?.name}. Platform overview across all organizers.</p>
          </div>
          <div className="flex gap-sm flex-wrap">
            <Link to="/admin/users" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">group</span> Users
            </Link>
            <Link to="/admin/moderation" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">gavel</span> Moderation
            </Link>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
            <span className="text-secondary font-body-sm font-medium uppercase tracking-wider mb-xs">Total Events</span>
            <span className="font-display text-[32px] text-on-surface">{totals.totalEvents}</span>
            <span className="text-secondary font-body-sm mt-xs font-medium">{totals.activeEvents} published</span>
          </div>
          <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
            <span className="text-secondary font-body-sm font-medium uppercase tracking-wider mb-xs">Tickets Sold</span>
            <span className="font-display text-[32px] text-on-surface">{totals.ticketsSold.toLocaleString()}</span>
            <span className="text-emerald-600 font-body-sm mt-xs font-medium">across all events</span>
          </div>
          <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
            <span className="text-secondary font-body-sm font-medium uppercase tracking-wider mb-xs">Platform Revenue</span>
            <span className="font-display text-[32px] text-on-surface">{money(totals.revenue)}</span>
            <span className="text-emerald-600 font-body-sm mt-xs font-medium">gross ticket sales</span>
          </div>
          <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm flex flex-col">
            <span className="text-secondary font-body-sm font-medium uppercase tracking-wider mb-xs">Pending Approvals</span>
            <span className={`font-display text-[32px] ${totals.pending > 0 ? 'text-error' : 'text-on-surface'}`}>{totals.pending}</span>
            <span className={`font-body-sm mt-xs font-medium ${totals.pending > 0 ? 'text-error' : 'text-secondary'}`}>{totals.pending > 0 ? 'Action required' : 'All clear'}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2 space-y-lg">
            {/* Revenue chart */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h2 className="font-headline-sm font-bold text-on-surface mb-lg">Revenue by Event</h2>
              {byRevenue.length === 0 ? (
                <p className="text-secondary font-body-md">No published events yet.</p>
              ) : (
                <div className="space-y-md">
                  {byRevenue.map((e) => {
                    const rev = eventRevenue(e);
                    return (
                      <div key={e.id} className="space-y-xs">
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface font-medium truncate pr-md">{e.title}</span>
                          <span className="text-secondary whitespace-nowrap">{money(rev)}</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((rev / maxRev) * 100)}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending approvals */}
            <h2 className="font-headline-md font-bold text-on-surface border-b border-outline-variant pb-xs">Events Pending Approval</h2>
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              {pending.length === 0 ? (
                <div className="p-xl text-center text-secondary font-body-md">No events waiting for review. 🎉</div>
              ) : (
                pending.map((e) => (
                  <div key={e.id} className="p-md border-b border-outline-variant last:border-b-0 flex justify-between items-center hover:bg-surface-container-lowest transition-colors">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-variant flex items-center justify-center shrink-0">
                        {e.coverImage ? <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-secondary">image</span>}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{e.title}</h4>
                        <p className="text-secondary font-body-sm">Organizer: {e.organizerName}</p>
                      </div>
                    </div>
                    <div className="flex gap-sm items-center">
                      <button onClick={() => rejectEvent(e.id)} className="text-error font-bold font-label-md hover:underline">Reject</button>
                      <button onClick={() => approveEvent(e.id)} className="bg-primary text-white px-md py-xs rounded-full font-bold font-label-md hover:bg-primary-container hover:text-on-primary-container">Approve</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-lg">
            <h2 className="font-headline-md font-bold text-on-surface border-b border-outline-variant pb-xs">System Alerts</h2>
            {totals.pending > 0 && (
              <div className="bg-error-container text-on-error-container rounded-2xl p-md shadow-sm">
                <div className="flex items-center gap-xs font-bold mb-xs">
                  <span className="material-symbols-outlined">gavel</span> {totals.pending} event{totals.pending === 1 ? '' : 's'} awaiting review
                </div>
                <p className="font-body-sm">Review the pending queue to keep new events moving live.</p>
              </div>
            )}
            <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-md shadow-sm">
              <div className="flex items-center gap-xs font-bold mb-xs">
                <span className="material-symbols-outlined">info</span> Platform Health
              </div>
              <p className="font-body-sm">{totals.activeEvents} live events generating {money(totals.revenue)} in gross sales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
