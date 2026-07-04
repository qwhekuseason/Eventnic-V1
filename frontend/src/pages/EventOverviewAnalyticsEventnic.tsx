// @ts-nocheck
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useEvents, eventSold, eventCapacity, eventRevenue, eventSoldPct, eventTotalVotes, eventVotingRevenue, eventTotalRevenue } from '../contexts/EventsContext';
import { useNominations } from '../contexts/NominationsContext';
import EventNominationsTab from '../components/EventNominationsTab';

const money = (n) => 'GH₵ ' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function EventOverviewAnalyticsEventnic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { getEvent, getPublishedEvents, getEventsByOrganizer, updateEvent } = useEvents();
  const { nominations } = useNominations();
  const [activeTab, setActiveTab] = useState('Overview');

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
  const ticketRev = eventRevenue(event);
  const pct = eventSoldPct(event);
  const avg = sold > 0 ? ticketRev / sold : 0;
  const maxTierRevenue = Math.max(1, ...event.ticketTiers.map((t) => t.sold * t.price));
  
  const totalVotes = eventTotalVotes(event);
  const voteRev = eventVotingRevenue(event);
  const totalRev = eventTotalRevenue(event);

  // Nomination counts for badge
  const eventNominations = nominations.filter(n => n.eventId === event.id);
  const pendingNominations = eventNominations.filter(n => n.status === 'pending').length;

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

  const tabs = [
    { key: 'Overview', icon: 'dashboard', badge: 0 },
    { key: 'Ticketing', icon: 'confirmation_number', badge: 0 },
    { key: 'Voting', icon: 'how_to_vote', badge: 0 },
    { key: 'Nominations', icon: 'person_add', badge: pendingNominations },
    { key: 'Event Details', icon: 'info', badge: 0 },
  ];

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      {/* ── Header ── */}
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
        <div className="flex items-center gap-md flex-wrap">
          {event.votingEnabled && (
            <button
              onClick={() => {
                const url = `${window.location.origin}/event/${event.slug}/nominate`;
                navigator.clipboard.writeText(url);
                alert('Nomination link copied to clipboard!');
              }}
              className="flex items-center gap-sm bg-primary/10 text-primary px-md py-base rounded-lg border border-primary/20 font-label-md text-label-md hover:bg-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy Nomination Link
            </button>
          )}
          <button onClick={exportCsv} className="flex items-center gap-sm bg-surface-container-highest text-on-surface px-md py-base rounded-lg border border-outline-variant font-label-md text-label-md hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-[18px]">file_download</span> Export CSV
          </button>
          <button onClick={() => navigate(`/event/${event.slug}/edit`)} className="flex items-center gap-sm bg-primary text-on-primary px-lg py-base rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 active:scale-[0.99] transition-all">
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit Event
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex border-b border-outline-variant mb-xl gap-md overflow-x-auto">
        {tabs.map(t => (
          <button 
            key={t.key} 
            onClick={() => setActiveTab(t.key)} 
            className={`pb-sm font-label-md transition-all border-b-2 px-sm flex items-center gap-xs whitespace-nowrap ${activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.key}
            {t.badge > 0 && (
              <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'Overview' && (
        <div className="space-y-xl">
          {sold === 0 && (
            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-lg flex items-center gap-md">
              <span className="material-symbols-outlined">info</span>
              <div>
                <p className="font-bold">No sales yet</p>
                <p className="font-body-sm">Once attendees start buying tickets or casting paid votes, revenue and analytics will appear here. Share your public event page to get going.</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
              <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Total Gross Revenue</p>
              <h2 className="text-headline-md font-headline-md text-on-surface">{money(totalRev)}</h2>
              <p className="text-secondary font-body-sm text-body-sm mt-xs">Tickets + Voting combined</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
              <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">confirmation_number</span> Total Ticket Sales</p>
              <h2 className="text-headline-md font-headline-md text-on-surface">{sold.toLocaleString()} / {cap.toLocaleString()}</h2>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-sm"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }}></div></div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
              <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">how_to_vote</span> Total Votes Cast</p>
              <h2 className="text-headline-md font-headline-md text-on-surface">{totalVotes.toLocaleString()}</h2>
              <p className="text-secondary font-body-sm text-body-sm mt-xs">{event.votingEnabled ? 'Across all categories' : 'Voting disabled'}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-lg">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              <button onClick={() => setActiveTab('Nominations')} className="flex flex-col items-center gap-sm p-lg rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <span className="font-label-md text-on-surface text-center">Nominations</span>
                {pendingNominations > 0 && <span className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingNominations} pending</span>}
              </button>
              <button onClick={() => setActiveTab('Ticketing')} className="flex flex-col items-center gap-sm p-lg rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary group-hover:text-white transition-colors text-tertiary">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <span className="font-label-md text-on-surface text-center">Ticketing</span>
              </button>
              <button onClick={() => setActiveTab('Voting')} className="flex flex-col items-center gap-sm p-lg rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-500">
                  <span className="material-symbols-outlined">how_to_vote</span>
                </div>
                <span className="font-label-md text-on-surface text-center">Voting Results</span>
              </button>
              <button onClick={() => setActiveTab('Event Details')} className="flex flex-col items-center gap-sm p-lg rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-500">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <span className="font-label-md text-on-surface text-center">Event Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticketing Tab ── */}
      {activeTab === 'Ticketing' && (
        <div className="space-y-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
             <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm border-l-4 border-l-primary">
              <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md">Ticket Revenue</p>
              <h2 className="text-headline-md font-headline-md text-on-surface">{money(ticketRev)}</h2>
              <p className="text-secondary font-body-sm text-body-sm mt-xs">from {sold.toLocaleString()} tickets</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
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
                <button onClick={() => navigate('/event-attendees')} className="w-full py-md text-primary font-bold font-label-md text-label-md hover:bg-primary/10 rounded-lg transition-all">View Attendees</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Voting Tab ── */}
      {activeTab === 'Voting' && (
        <div className="space-y-xl">
          {!event.votingEnabled ? (
            <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl shadow-sm text-center">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-md">how_to_vote</span>
              <h2 className="font-headline-sm text-on-surface mb-sm">Voting is Disabled</h2>
              <p className="text-secondary">Enable voting in event settings to see analytics here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm border-l-4 border-l-tertiary">
                  <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">payments</span> Voting Revenue</p>
                  <h2 className="text-headline-md font-headline-md text-on-surface">{money(voteRev)}</h2>
                  <p className="text-secondary font-body-sm text-body-sm mt-xs">GH₵ {event.votePrice || 0} per vote</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
                  <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">how_to_vote</span> Total Votes Cast</p>
                  <h2 className="text-headline-md font-headline-md text-on-surface">{totalVotes.toLocaleString()}</h2>
                  <p className="text-secondary font-body-sm text-body-sm mt-xs">Across {event.votingCategories.length} categor{event.votingCategories.length === 1 ? 'y' : 'ies'}</p>
                </div>
              </div>

              {event.votingCategories.length > 0 && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  <div className="p-xl border-b border-outline-variant">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm"><span className="material-symbols-outlined text-primary">how_to_vote</span> Community Voting Results</h3>
                    <p className="text-secondary font-body-sm text-body-sm">Live tallies for your award categories</p>
                  </div>
                  <div className="p-xl grid grid-cols-1 xl:grid-cols-2 gap-xl">
                    {event.votingCategories.map((c) => {
                      const total = c.nominees.reduce((n, x) => n + x.votes, 0);
                      const sorted = [...c.nominees].sort((a, b) => b.votes - a.votes);
                      const catRev = total * (event.votePrice || 0);
                      
                      return (
                        <div key={c.id} className="bg-surface p-lg rounded-xl border border-outline-variant">
                          <div className="flex justify-between items-start mb-lg">
                            <h4 className="font-label-lg text-on-surface font-bold">{c.name}</h4>
                            <span className="text-secondary font-label-sm bg-surface-container-highest px-sm py-xs rounded">{money(catRev)} generated</span>
                          </div>
                          
                          <div className="space-y-md">
                            {sorted.map((n) => {
                              const share = total > 0 ? Math.round((n.votes / total) * 100) : 0;
                              return (
                                <div key={n.id} className="space-y-xs">
                                  <div className="flex justify-between text-label-sm">
                                    <span className="text-on-surface font-medium">{n.name}</span>
                                    <span className="text-secondary font-bold">{n.votes.toLocaleString()} <span className="font-normal opacity-70">· {share}%</span></span>
                                  </div>
                                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-tertiary h-2.5 rounded-full" style={{ width: `${share}%` }}></div>
                                  </div>
                                </div>
                              );
                            })}
                            {sorted.length === 0 && <p className="text-secondary font-body-sm italic">No nominees in this category yet.</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Nominations Tab ── */}
      {activeTab === 'Nominations' && (
        <EventNominationsTab eventId={event.id} />
      )}

      {/* ── Event Details Tab ── */}
      {activeTab === 'Event Details' && (
        <div className="space-y-xl">
          {/* Event Info Card */}
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            {/* Cover Image */}
            {event.coverImage && (
              <div className="w-full h-48 md:h-64 overflow-hidden">
                <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-xl">
              <div className="flex flex-col md:flex-row justify-between items-start gap-lg mb-xl">
                <div>
                  <h2 className="font-display text-[32px] text-on-surface mb-xs">{event.title}</h2>
                  <div className="flex flex-wrap items-center gap-md text-secondary font-body-md">
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">calendar_today</span> {event.date || 'Date TBD'}</span>
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">schedule</span> {event.time || 'Time TBD'}</span>
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">location_on</span> {event.location || 'Location TBD'}</span>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <span className={`px-md py-xs rounded-full font-label-sm text-label-sm border flex items-center gap-1 ${
                    event.status === 'published' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    event.status === 'pending' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                    event.status === 'rejected' ? 'bg-red-100 text-red-600 border-red-200' :
                    'bg-surface-container-high text-secondary border-outline-variant'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      event.status === 'published' ? 'bg-emerald-500' :
                      event.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                      event.status === 'rejected' ? 'bg-red-500' :
                      'bg-outline'
                    }`}></span>
                    {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                  </span>
                  {event.votingEnabled && (
                    <span className="px-md py-xs rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm border border-tertiary/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">how_to_vote</span> Voting Enabled
                    </span>
                  )}
                  {event.rsvpEnabled && (
                    <span className="px-md py-xs rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event_available</span> RSVP Enabled
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-xl">
                <h3 className="font-headline-sm text-on-surface mb-sm">Description</h3>
                <p className="text-secondary font-body-md whitespace-pre-line">{event.description || 'No description provided.'}</p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Category</p>
                  <p className="font-bold text-on-surface">{event.category || '—'}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Location Type</p>
                  <p className="font-bold text-on-surface capitalize">{event.locationType || '—'}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Organizer</p>
                  <p className="font-bold text-on-surface">{event.organizerName || event.organizerEmail}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Event Slug</p>
                  <p className="font-bold text-on-surface font-mono text-sm">{event.slug}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Vote Price</p>
                  <p className="font-bold text-on-surface">{event.votingEnabled ? money(event.votePrice || 0) : 'N/A'}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                  <p className="text-secondary font-label-sm uppercase tracking-wider mb-sm">Voting End Date</p>
                  <p className="font-bold text-on-surface">{event.votingEndDate || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Tiers */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">confirmation_number</span> Ticket Tiers
            </h3>
            {event.ticketTiers.length === 0 ? (
              <p className="text-secondary font-body-md">No ticket tiers configured. This is a free / RSVP event.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {event.ticketTiers.map(t => (
                  <div key={t.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                    <h4 className="font-bold text-on-surface mb-sm">{t.name}</h4>
                    <div className="flex justify-between text-body-sm text-secondary mb-xs">
                      <span>Price</span>
                      <span className="font-bold text-on-surface">{money(t.price)}</span>
                    </div>
                    <div className="flex justify-between text-body-sm text-secondary mb-xs">
                      <span>Sold</span>
                      <span className="font-bold text-on-surface">{t.sold} / {t.quantity}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
                      <div className={`h-2 rounded-full ${t.sold >= t.quantity ? 'bg-outline' : 'bg-primary'}`} style={{ width: `${t.quantity > 0 ? Math.round((t.sold / t.quantity) * 100) : 0}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
              <h3 className="font-headline-sm text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary">mic</span> Speakers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {event.speakers.map(s => (
                  <div key={s.id} className="flex items-center gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                      {s.imageUrl ? <img className="w-full h-full object-cover" src={s.imageUrl} alt={s.name} /> : <span className="material-symbols-outlined text-primary">person</span>}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{s.name}</h4>
                      <p className="text-secondary font-body-sm">{s.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
              <h3 className="font-headline-sm text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">event_note</span> Agenda / Schedule
              </h3>
              <div className="space-y-md">
                {event.agenda.map(item => (
                  <div key={item.id} className="flex gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                    <div className="shrink-0 w-24 text-center">
                      <p className="font-bold text-primary text-sm">{item.start}</p>
                      <p className="text-secondary text-xs">to {item.end}</p>
                    </div>
                    <div className="border-l border-outline-variant pl-md">
                      <h4 className="font-bold text-on-surface">{item.title}</h4>
                      {item.description && <p className="text-secondary font-body-sm mt-xs">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voting Categories (read-only overview) */}
          {event.votingEnabled && event.votingCategories.length > 0 && (
            <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
              <h3 className="font-headline-sm text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary">how_to_vote</span> Voting Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {event.votingCategories.map(cat => (
                  <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                    <h4 className="font-bold text-on-surface mb-sm">{cat.name}</h4>
                    <p className="text-secondary font-body-sm">{cat.nominees.length} nominee{cat.nominees.length !== 1 ? 's' : ''}</p>
                    <div className="mt-sm flex flex-wrap gap-xs">
                      {cat.nominees.map(n => (
                        <span key={n.id} className="bg-surface-container px-sm py-xs rounded-full text-xs text-secondary border border-outline-variant">
                          {n.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public Links */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">link</span> Public Links
            </h3>
            <div className="space-y-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                <div>
                  <p className="font-label-md text-on-surface">Event Page</p>
                  <p className="text-secondary font-body-sm font-mono">{window.location.origin}/event/{event.slug}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}`); alert('Link copied!'); }} className="text-primary font-label-md font-bold hover:underline flex items-center gap-xs shrink-0">
                  <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy
                </button>
              </div>
              {event.votingEnabled && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                    <div>
                      <p className="font-label-md text-on-surface">Nomination Page</p>
                      <p className="text-secondary font-body-sm font-mono">{window.location.origin}/event/{event.slug}/nominate</p>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}/nominate`); alert('Link copied!'); }} className="text-primary font-label-md font-bold hover:underline flex items-center gap-xs shrink-0">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                    <div>
                      <p className="font-label-md text-on-surface">Voting Page</p>
                      <p className="text-secondary font-body-sm font-mono">{window.location.origin}/event/{event.slug}/vote</p>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}/vote`); alert('Link copied!'); }} className="text-primary font-label-md font-bold hover:underline flex items-center gap-xs shrink-0">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
