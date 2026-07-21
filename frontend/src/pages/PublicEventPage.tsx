// Removed unused useState, useEffect
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

export default function PublicEventPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getEvent } = useEvents();

  const event = getEvent(slug || '');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (!event) {
    return (
      <main className="pt-[140px] pb-xxl max-w-container-max mx-auto px-margin text-center">
        <h1 className="font-headline-lg text-on-surface mb-sm">Event not found</h1>
        <p className="text-secondary mb-lg">This event may have been removed or is not yet published.</p>
        <Link to="/explore" className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold">Browse Events</Link>
      </main>
    );
  }



  return (
    <main>
      {/* Hero */}
      <section className="relative h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {event.coverImage ? (
            <img alt={event.title} className="w-full h-full object-cover" src={event.coverImage} />
          ) : (
            <div className="w-full h-full hero-section"></div>
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
              <div key={s.id} className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col items-center text-center shadow-sm">
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
                <div key={a.id} className="flex flex-col md:flex-row gap-lg bg-surface p-lg rounded-xl border border-outline-variant hover:border-primary transition-all">
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
                <div key={t.id} className={`bg-surface p-xl rounded-xl flex flex-col h-full ${popular ? 'border-2 border-primary shadow-md relative' : 'border border-outline-variant shadow-sm'}`}>
                  {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-lg py-xs rounded-full font-label-sm text-label-sm">MOST POPULAR</div>}
                  <div className="mb-lg">
                    <span className={`px-md py-xs rounded-full font-label-sm text-label-sm uppercase tracking-widest ${soldOut ? 'bg-surface-container-high text-on-surface-variant' : 'bg-green-100 text-emerald-600 dark:text-emerald-400'}`}>{soldOut ? 'Sold Out' : 'On Sale'}</span>
                    <h3 className="font-headline-md text-headline-md mt-md">{t.name}</h3>
                  </div>
                  <div className="mb-xl">
                    <span className="font-display text-[40px] leading-none text-on-surface">GH₵ {Number(t.price).toLocaleString()}</span>
                    <span className="text-secondary font-body-md">/person</span>
                  </div>
                  <div className="flex-1 mb-xl text-secondary font-body-sm">{Math.max(0, t.quantity - t.sold).toLocaleString()} tickets remaining</div>
                  <button
                    disabled={soldOut}
                    onClick={() => navigate(`/checkout?event=${event.id}&tier=${t.id}`)}
                    className={`w-full ${soldOut ? 'bg-surface-container-high text-on-surface-variant py-base rounded-xl font-bold font-label-md cursor-not-allowed' : popular ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {soldOut ? 'Sold Out' : 'Buy Tickets'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Voting CTA */}
      {event.votingEnabled && event.votingCategories.length > 0 && (
        <section className="py-xxl bg-surface-container-lowest border-t border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin text-center">
            <span className="bg-tertiary-container text-on-tertiary-container px-md py-xs rounded-full font-label-sm uppercase tracking-widest mb-md inline-block">Live Voting Active</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Community Awards</h2>
            <p className="font-body-lg text-body-lg text-secondary mb-xl max-w-2xl mx-auto">
              Cast your vote for the innovators shaping the future. Support your favorite nominees or nominate someone new!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-md">
              <Link to={`/event/${event.slug}/vote`} className="btn-primary">
                Go to Voting Platform
              </Link>
              <Link to={`/event/${event.slug}/nominate`} className="btn-outline">
                Nominate Someone
              </Link>
            </div>
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
                  <p className="font-body-sm text-body-sm text-secondary mb-sm">{event.location || 'Details to be announced.'}</p>
                  
                  {event.locationCoordinates && event.locationType === 'physical' && (
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.locationCoordinates.lat},${event.locationCoordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-xs mt-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">directions</span>
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="h-[320px] bg-surface-container-high rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center border border-outline-variant">
              {event.locationCoordinates && event.locationType === 'physical' && isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={event.locationCoordinates}
                  zoom={15}
                  options={{ disableDefaultUI: true, zoomControl: true }}
                >
                  <Marker position={event.locationCoordinates} />
                </GoogleMap>
              ) : (
                <span className="material-symbols-outlined text-[64px] text-outline">map</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
