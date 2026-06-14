// @ts-nocheck
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEvents, eventSold, eventCapacity, eventRevenue, eventSoldPct } from '../contexts/EventsContext';

const money = (n) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function EventOverviewAnalyticsEventnic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { getEvent, getPublishedEvents } = useEvents();

  const eventId = params.get('event');
  const event = (eventId && getEvent(eventId)) || getPublishedEvents()[0];

  if (!event) {
    return (
      <main className="max-w-container-max mx-auto px-margin pt-[140px] pb-xxl text-center">
        <h1 className="font-headline-md text-on-surface mb-sm">No event selected</h1>
        <p className="text-secondary mb-lg">Pick an event from your dashboard to see its analytics.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold">Back to Dashboard</button>
      </main>
    );
  }

  const sold = eventSold(event);
  const cap = eventCapacity(event);
  const revenue = eventRevenue(event);
  const pct = eventSoldPct(event);
  const avg = sold > 0 ? revenue / sold : 0;
  const maxTierRevenue = Math.max(1, ...event.ticketTiers.map((t) => t.sold * t.price));

  const exportCsv = () => {
    const rows = [['Tier', 'Price', 'Sold', 'Quantity', 'Revenue']];
    event.ticketTiers.forEach((t) => rows.push([t.name, t.price, t.sold, t.quantity, t.sold * t.price]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${event.slug}-sales.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div className="flex flex-col gap-xs">
          <nav className="flex items-center gap-xs text-secondary font-label-sm text-label-sm">
            <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:underline">Events</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary">{event.title}</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">{event.title}</h1>
          <p className="text-secondary font-body-md text-body-md">{[event.location, event.date].filter(Boolean).join(' • ') || '—'}</p>
        </div>
        <div className="flex items-center gap-md">
          <button onClick={exportCsv} className="flex items-center gap-sm bg-surface-container-highest text-on-surface px-md py-base rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-[18px]">file_download</span> Export CSV
          </button>
          <button onClick={() => alert('Event editing is coming soon.')} className="flex items-center gap-sm bg-primary text-on-primary px-lg py-base rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 active:scale-[0.99] transition-all">
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit Event
          </button>
        </div>
      </div>

      {sold === 0 && (
        <div className="mb-xl bg-secondary-container text-on-secondary-container rounded-xl p-lg flex items-center gap-md">
          <span className="material-symbols-outlined">info</span>
          <div>
            <p className="font-bold">No sales yet</p>
            <p className="font-body-sm">Once attendees start buying tickets, revenue and analytics will appear here. Share your public event page to get going.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xxl">
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
          <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md">Total Revenue</p>
          <h2 className="text-headline-md font-headline-md text-on-surface">{money(revenue)}</h2>
          <p className="text-secondary font-body-sm text-body-sm mt-xs">from {sold.toLocaleString()} tickets</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-md">
            <p className="text-secondary font-label-md text-label-md uppercase tracking-wider">Ticket Sales</p>
            <span className="bg-primary-fixed text-on-primary-fixed text-[12px] px-sm py-xs rounded font-bold">{pct}%</span>
          </div>
          <h2 className="text-headline-md font-headline-md text-on-surface">{sold.toLocaleString()} / {cap.toLocaleString()}</h2>
          <div className="w-full bg-surface-container-high h-2 rounded-full mt-md"><div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }}></div></div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
          <p className="text-secondary font-label-md text-label-md mb-md uppercase tracking-wider">Avg. Ticket Price</p>
          <h2 className="text-headline-md font-headline-md text-on-surface">{money(avg)}</h2>
          <p className="text-secondary font-body-sm text-body-sm mt-xs">per ticket sold</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
          <p className="text-secondary font-label-md text-label-md mb-md uppercase tracking-wider">Capacity Left</p>
          <h2 className="text-headline-md font-headline-md text-on-surface">{(cap - sold).toLocaleString()}</h2>
          <p className="text-secondary font-body-sm text-body-sm mt-xs">tickets remaining</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-xxl">
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-xl rounded-xl shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xl">Revenue by Tier</h3>
          {event.ticketTiers.length === 0 ? (
            <p className="text-secondary font-body-md">This is a free / RSVP-only event — no ticket tiers.</p>
          ) : (
            <div className="space-y-lg">
              {event.ticketTiers.map((t) => {
                const rev = t.sold * t.price;
                return (
                  <div key={t.id} className="space-y-sm">
                    <div className="flex justify-between text-label-md font-label-md">
                      <span className="text-on-surface">{t.name}</span>
                      <span className="text-secondary">{money(rev)} · {t.sold}/{t.quantity}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                      <div className="bg-primary h-3 rounded-full" style={{ width: `${Math.round((rev / maxTierRevenue) * 100)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-xl rounded-xl shadow-sm flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xl">Tier Sell-through</h3>
          <div className="space-y-lg flex-grow">
            {event.ticketTiers.map((t) => {
              const tpct = t.quantity > 0 ? Math.round((t.sold / t.quantity) * 100) : 0;
              return (
                <div key={t.id} className="space-y-sm">
                  <div className="flex justify-between text-label-md font-label-md">
                    <span className="text-on-surface">{t.name}</span>
                    <span className="text-secondary">{tpct >= 100 ? 'Sold Out' : `${tpct}%`}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full ${tpct >= 100 ? 'bg-outline' : 'bg-primary'}`} style={{ width: `${tpct}%` }}></div>
                  </div>
                </div>
              );
            })}
            {event.ticketTiers.length === 0 && <p className="text-secondary font-body-sm">No tiers to show.</p>}
          </div>
          <div className="mt-xl pt-xl border-t border-outline-variant">
            <button onClick={() => navigate('/event-attendees')} className="w-full py-md text-primary font-bold font-label-md text-label-md hover:bg-primary/5 rounded-lg transition-all">View Attendees</button>
          </div>
        </div>
      </div>

      {event.votingEnabled && event.votingCategories.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-xl border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm"><span className="material-symbols-outlined text-primary">how_to_vote</span> Community Voting Results</h3>
            <p className="text-secondary font-body-sm text-body-sm">Live tallies for your award categories</p>
          </div>
          <div className="p-xl grid grid-cols-1 md:grid-cols-2 gap-xl">
            {event.votingCategories.map((c) => {
              const total = c.nominees.reduce((n, x) => n + x.votes, 0);
              const sorted = [...c.nominees].sort((a, b) => b.votes - a.votes);
              return (
                <div key={c.id}>
                  <h4 className="font-label-md text-on-surface font-bold mb-md">{c.name}</h4>
                  <div className="space-y-md">
                    {sorted.map((n) => {
                      const share = total > 0 ? Math.round((n.votes / total) * 100) : 0;
                      return (
                        <div key={n.id} className="space-y-xs">
                          <div className="flex justify-between text-label-sm"><span className="text-on-surface">{n.name}</span><span className="text-secondary">{n.votes.toLocaleString()} · {share}%</span></div>
                          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-tertiary h-2 rounded-full" style={{ width: `${share}%` }}></div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
