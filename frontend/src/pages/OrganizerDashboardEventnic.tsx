// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, eventSold, eventCapacity, eventSoldPct } from '../contexts/EventsContext';

const money = (n) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function StatusBadge({ event }) {
  if (event.status === 'pending') return <span className="px-sm py-xs rounded-full bg-amber-100 text-amber-700 font-label-sm text-label-sm border border-amber-200">Pending Review</span>;
  if (event.status === 'draft') return <span className="px-sm py-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-outline-variant">Draft</span>;
  if (event.status === 'rejected') return <span className="px-sm py-xs rounded-full bg-red-100 text-red-700 font-label-sm text-label-sm border border-red-200">Rejected</span>;
  const pct = eventSoldPct(event);
  if (pct >= 90) return <span className="px-sm py-xs rounded-full bg-red-100 text-red-700 font-label-sm text-label-sm border border-red-200">Selling Fast</span>;
  return <span className="px-sm py-xs rounded-full bg-green-100 text-green-700 font-label-sm text-label-sm border border-green-200">On Sale</span>;
}

export default function OrganizerDashboardEventnic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEventsByOrganizer, organizerTotals } = useEvents();

  const email = user?.email || '';
  const events = getEventsByOrganizer(email);
  const totals = organizerTotals(email);

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xxl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Organizer Dashboard</h1>
          <p className="font-body-md text-body-md text-secondary mt-xs">Welcome back, {user?.name}. Overview of your events performance and ticketing logistics.</p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <Link to="/organizer/scanner" className="flex items-center justify-center gap-xs bg-surface border border-outline-variant text-on-surface px-md h-[56px] rounded-xl font-bold shadow-sm hover:bg-surface-container-lowest transition-colors">
            <span className="material-symbols-outlined">qr_code_scanner</span> Scanner
          </Link>
          <Link to="/organizer/broadcasts" className="flex items-center justify-center gap-xs bg-surface border border-outline-variant text-on-surface px-md h-[56px] rounded-xl font-bold shadow-sm hover:bg-surface-container-lowest transition-colors">
            <span className="material-symbols-outlined">mail</span> Broadcast
          </Link>
          <button onClick={() => navigate('/create-event/basic-info')} className="flex items-center justify-center gap-sm bg-primary text-on-primary px-lg h-[56px] rounded-xl font-bold shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">add</span>
            <span className="font-label-md text-label-md">Create Event</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-md">
            <span className="text-secondary font-label-md text-label-md">Total Revenue</span>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary"><span className="material-symbols-outlined">payments</span></div>
          </div>
          <span className="font-headline-lg text-headline-lg text-on-surface">{money(totals.revenue)}</span>
          <div className="flex items-center gap-xs mt-xs text-secondary font-label-sm text-label-sm">Across {totals.totalEvents} event{totals.totalEvents === 1 ? '' : 's'}</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-md">
            <span className="text-secondary font-label-md text-label-md">Tickets Sold</span>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary"><span className="material-symbols-outlined">confirmation_number</span></div>
          </div>
          <span className="font-headline-lg text-headline-lg text-on-surface">{totals.ticketsSold.toLocaleString()}</span>
          <div className="flex items-center gap-xs mt-xs text-secondary font-label-sm text-label-sm">Total across all tiers</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-md">
            <span className="text-secondary font-label-md text-label-md">Active Events</span>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary"><span className="material-symbols-outlined">event_available</span></div>
          </div>
          <span className="font-headline-lg text-headline-lg text-on-surface">{totals.activeEvents}</span>
          <div className="flex items-center gap-xs mt-xs text-secondary font-label-sm text-label-sm">Published &amp; on sale</div>
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Your Events</h2>
          <button onClick={() => navigate('/create-event/basic-info')} className="text-primary font-label-md text-label-md hover:underline">+ New Event</button>
        </div>

        {events.length === 0 ? (
          <div className="p-xxl flex flex-col items-center text-center gap-md">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[32px]">event</span></div>
            <div>
              <h3 className="font-headline-sm text-on-surface">No events yet</h3>
              <p className="text-secondary font-body-md">Create your first event to start selling tickets and running voting.</p>
            </div>
            <button onClick={() => navigate('/create-event/basic-info')} className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold shadow-md hover:opacity-90 transition-all">Create Event</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-outline-variant bg-surface-container-lowest">
                  <th className="px-lg py-md font-label-md text-label-md text-secondary">Event Details</th>
                  <th className="px-lg py-md font-label-md text-label-md text-secondary">Date &amp; Time</th>
                  <th className="px-lg py-md font-label-md text-label-md text-secondary">Sales Progress</th>
                  <th className="px-lg py-md font-label-md text-label-md text-secondary">Status</th>
                  <th className="px-lg py-md"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {events.map((e) => {
                  const sold = eventSold(e);
                  const cap = eventCapacity(e);
                  const pct = eventSoldPct(e);
                  return (
                    <tr key={e.id} onClick={() => navigate(`/event-analytics?event=${e.id}`)} className="hover:bg-surface-container-low cursor-pointer transition-colors group">
                      <td className="px-lg py-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-variant flex items-center justify-center">
                            {e.coverImage ? <img alt={e.title} className="w-full h-full object-cover" src={e.coverImage} /> : <span className="material-symbols-outlined text-secondary">image</span>}
                          </div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface">{e.title}</div>
                            <div className="font-body-sm text-body-sm text-secondary">{e.location || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-lg">
                        <div className="font-body-md text-body-md text-on-surface">{e.date || 'TBD'}</div>
                        <div className="font-body-sm text-body-sm text-secondary">{e.time || ''}</div>
                      </td>
                      <td className="px-lg py-lg">
                        <div className="flex flex-col gap-xs w-48">
                          <div className="flex justify-between font-label-sm text-label-sm">
                            <span className="text-on-surface">{sold.toLocaleString()} / {cap.toLocaleString()}</span>
                            <span className={`font-bold ${pct >= 90 ? 'text-red-600' : 'text-primary'}`}>{pct}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-lg"><StatusBadge event={e} /></td>
                      <td className="px-lg py-lg text-right">
                        <button onClick={(ev) => { ev.stopPropagation(); navigate(`/event-analytics?event=${e.id}`); }} className="p-xs hover:bg-surface-container-high rounded-lg text-secondary">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
