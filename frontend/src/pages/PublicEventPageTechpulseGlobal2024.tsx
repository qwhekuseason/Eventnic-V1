// @ts-nocheck
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';

export default function PublicEventPageTechpulseGlobal2024() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getEvent, castVote, hasVoted } = useEvents();

  const event = getEvent(slug);

  if (!event) {
    return (
      <main className="pt-[140px] pb-xxl max-w-container-max mx-auto px-margin text-center">
        <h1 className="font-headline-lg text-on-surface mb-sm">Event not found</h1>
        <p className="text-secondary mb-lg">This event may have been removed or is not yet published.</p>
        <Link to="/explore" className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold">Browse Events</Link>
      </main>
    );
  }

  const vote = (categoryId, nomineeId, nomineeName) => {
    const ok = castVote(event.id, categoryId, nomineeId);
    alert(ok ? `Vote recorded for ${nomineeName}!` : 'You have already voted in this category.');
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {event.coverImage ? (
            <img alt={event.title} className="w-full h-full object-cover" src={event.coverImage} />
          ) : (
            <div className="w-full h-full bg-gradient-dark"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-on-background/30"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-xs px-sm py-xs bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 mb-md">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
              <span className="font-label-md text-label-md">{event.date || 'Date TBA'}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
            <h1 className="font-display text-display mb-md">{event.title}</h1>
            {event.description && <p className="font-body-lg text-body-lg text-surface-variant mb-xl">{event.description}</p>}
            <div className="flex flex-wrap gap-md">
              <div className="flex items-center gap-base font-body-md text-body-md">
                <span className="material-symbols-outlined">location_on</span>
                {event.location || (event.locationType === 'online' ? 'Online Event' : 'Venue TBA')}
              </div>
              <div className="flex items-center gap-base font-body-md text-body-md capitalize">
                <span className="material-symbols-outlined">category</span>
                {event.category || 'Event'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <section className="py-xxl max-w-container-max mx-auto px-margin">
          <div className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Speakers</h2>
            <p className="font-body-md text-body-md text-secondary">Learn from the architects of the future.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {event.speakers.map((s) => (
              <div key={s.id} className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col items-center text-center shadow-sm">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high text-primary flex items-center justify-center mb-md">
                  {s.imageUrl ? (
                    <img className="w-full h-full object-cover" src={s.imageUrl} alt={s.name || 'Speaker'} />
                  ) : (
                    <span className="material-symbols-outlined text-[40px]">person</span>
                  )}
                </div>
                <h3 className="font-headline-sm text-on-surface">{s.name}</h3>
                <p className="font-body-sm text-secondary">{s.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Schedule */}
      {event.agenda.length > 0 && (
        <section className="py-xxl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Event Schedule</h2>
              <p className="font-body-md text-body-md text-secondary">A curated flow of knowledge and networking.</p>
            </div>
            <div className="space-y-md">
              {event.agenda.map((a) => (
                <div key={a.id} className="flex flex-col md:flex-row gap-lg bg-white p-lg rounded-xl border border-outline-variant hover:border-primary transition-all">
                  <div className="md:w-32">
                    <span className="font-headline-sm text-headline-sm text-primary">{a.start || 'TBA'}</span>
                    {a.end && <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">until {a.end}</div>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline-sm text-headline-sm mb-xs">{a.title}</h4>
                    {a.description && <p className="font-body-md text-body-md text-secondary">{a.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tickets */}
      {event.ticketTiers.length > 0 && (
        <section className="py-xxl max-w-container-max mx-auto px-margin">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Choose Your Experience</h2>
            <p className="font-body-md text-body-md text-secondary">Tailored access for professionals and enthusiasts alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch">
            {event.ticketTiers.map((t, i) => {
              const soldOut = t.sold >= t.quantity && t.quantity > 0;
              const popular = i === 1;
              return (
                <div key={t.id} className={`bg-white p-xl rounded-xl flex flex-col h-full ${popular ? 'border-2 border-primary shadow-md relative' : 'border border-outline-variant shadow-sm'}`}>
                  {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-lg py-xs rounded-full font-label-sm text-label-sm">MOST POPULAR</div>}
                  <div className="mb-lg">
                    <span className={`px-md py-xs rounded-full font-label-sm text-label-sm uppercase tracking-widest ${soldOut ? 'bg-surface-container-high text-on-surface-variant' : 'bg-green-100 text-green-700'}`}>{soldOut ? 'Sold Out' : 'On Sale'}</span>
                    <h3 className="font-headline-md text-headline-md mt-md">{t.name}</h3>
                  </div>
                  <div className="mb-xl">
                    <span className="font-display text-[40px] leading-none text-on-surface">${Number(t.price).toLocaleString()}</span>
                    <span className="text-secondary font-body-md">/person</span>
                  </div>
                  <div className="flex-1 mb-xl text-secondary font-body-sm">{Math.max(0, t.quantity - t.sold).toLocaleString()} tickets remaining</div>
                  <button
                    disabled={soldOut}
                    onClick={() => navigate(`/checkout?event=${event.id}&tier=${t.id}`)}
                    className={`w-full py-md font-bold rounded-lg transition-all font-label-md text-label-md ${soldOut ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : popular ? 'bg-primary text-on-primary hover:opacity-90' : 'border border-outline hover:bg-surface-container'}`}
                  >
                    {soldOut ? 'Sold Out' : 'Buy Tickets'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Voting */}
      {event.votingEnabled && event.votingCategories.length > 0 && (
        <section className="py-xxl bg-surface-container-lowest border-t border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="text-center mb-xl">
              <span className="bg-tertiary-container text-on-tertiary-container px-md py-xs rounded-full font-label-sm uppercase tracking-widest mb-md inline-block">Live Voting</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Community Awards</h2>
              <p className="font-body-md text-body-md text-secondary mb-md">Cast your vote for the innovators shaping the future. No account required.</p>
              {event.votingEndDate && <p className="font-body-sm text-secondary mb-md">Voting closes on {event.votingEndDate}.</p>}
              <Link to={`/event/${event.slug}/nominate`} className="inline-block bg-surface border border-outline hover:border-primary text-primary font-bold px-lg py-sm rounded-full transition-colors">
                Nominate Someone
              </Link>
            </div>

            {event.votingCategories.map((cat) => {
              const total = cat.nominees.reduce((n, x) => n + x.votes, 0);
              const voted = hasVoted(event.id, cat.id);
              return (
                <div key={cat.id} className="mb-xxl">
                  <div className="flex items-center justify-between mb-md">
                    <h3 className="font-headline-md text-on-surface">{cat.name}</h3>
                    {voted && <span className="text-primary font-label-md flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">check_circle</span> You voted</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    {cat.nominees.map((nom) => {
                      const share = total > 0 ? Math.round((nom.votes / total) * 100) : 0;
                      return (
                        <div key={nom.id} className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col text-center shadow-sm hover:border-primary transition-all">
                          <div className="w-20 h-20 rounded-full mb-md overflow-hidden mx-auto bg-surface-container-high flex items-center justify-center">
                            {nom.imageUrl ? (
                              <img className="w-full h-full object-cover" src={nom.imageUrl} alt={nom.name || 'Nominee'} />
                            ) : (
                              <span className="material-symbols-outlined text-[36px]">emoji_events</span>
                            )}
                          </div>
                          <h4 className="font-headline-sm font-bold text-on-surface">{nom.name}</h4>
                          <p className="text-secondary font-body-sm mb-md">{nom.description}</p>
                          <div className="mb-md">
                            <div className="flex justify-between text-label-sm mb-xs"><span className="text-on-surface font-bold">{nom.votes.toLocaleString()} votes</span><span className="text-secondary">{share}%</span></div>
                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-tertiary h-2 rounded-full" style={{ width: `${share}%` }}></div></div>
                          </div>
                          <button
                            disabled={voted}
                            onClick={() => vote(cat.id, nom.id, nom.name)}
                            className={`mt-auto w-full py-sm font-bold rounded-full transition-all flex items-center justify-center gap-xs ${voted ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">how_to_vote</span> {voted ? 'Voted' : 'Vote'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Location */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xxl items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Getting There</h2>
              <p className="font-body-lg text-body-lg text-secondary mb-xl">{event.locationType === 'online' ? 'This is an online event — your access link will be emailed after registration.' : `Join us at ${event.location || 'the venue'}.`}</p>
              <div className="flex gap-md">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">{event.locationType === 'online' ? 'videocam' : 'location_on'}</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm capitalize">{event.locationType} Event</h4>
                  <p className="font-body-sm text-body-sm text-secondary">{event.location || 'Details to be announced.'}</p>
                </div>
              </div>
            </div>
            <div className="h-[320px] bg-surface-container-high rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-outline">map</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
