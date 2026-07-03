// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvents, eventSold } from '../contexts/EventsContext';

const CATEGORIES = ['All', 'Conference', 'Workshop', 'Concert', 'Networking', 'Exhibition'];
const ICONS = { 'conference': 'category', 'workshop': 'draw', 'concert': 'music_note', 'networking': 'groups', 'exhibition': 'storefront', 'all': 'apps' };

const priceLabel = (e) => {
  if (!e.ticketTiers.length) return 'Free';
  const prices = e.ticketTiers.map((t) => Number(t.price)).filter((p) => p > 0);
  if (prices.length === 0) return 'Free';
  const min = Math.min(...prices);
  return e.ticketTiers.length > 1 ? `From GH₵ ${min.toLocaleString()}` : `GH₵ ${min.toLocaleString()}`;
};

export default function ExploreEventsEventnic() {
  const navigate = useNavigate();
  const { getPublishedEvents } = useEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const all = getPublishedEvents();
  const filtered = all.filter((e) => {
    const matchesCat = category === 'All' || (e.category || '').toLowerCase() === category.toLowerCase();
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [e.title, e.location, e.category].some((f) => (f || '').toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Banner */}
      <section className="relative pt-[160px] pb-[80px] overflow-hidden hero-section">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute bottom-0 -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[100px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-md">
              Explore <span className="text-primary">Events</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[640px] mx-auto mb-xl">
              Discover conferences, festivals, workshops and more happening around the world.
            </p>
            <div className="glass-panel-dark max-w-[640px] mx-auto rounded-full p-2 flex items-center shadow-2xl transition-all focus-within:ring-2 focus-within:ring-tertiary">
              <span className="material-symbols-outlined text-white/50 ml-md mr-sm">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by name, location, or category..."
                className="flex-grow !bg-transparent border-none outline-none !text-white placeholder-white/50 font-body-md py-sm"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/50 hover:text-white mr-md flex items-center">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="flex flex-wrap gap-sm mb-xl justify-center md:justify-start">
            {CATEGORIES.map((cat) => {
              const iconKey = cat.toLowerCase();
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-xs px-lg py-sm rounded-full font-label-md transition-all shadow-sm ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md scale-105'
                      : 'bg-surface-container-low text-secondary border border-outline-variant hover:bg-surface-container-high hover:text-on-surface hover:shadow'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-white' : 'text-primary'}`}>
                    {ICONS[iconKey] || 'category'}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-xl pb-sm border-b border-outline-variant">
            <p className="text-secondary font-body-md">
              Showing <span className="text-on-surface font-bold">{filtered.length}</span> event{filtered.length === 1 ? '' : 's'}
            </p>
          </div>

          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-xxl text-secondary bg-surface rounded-3xl border border-outline-variant max-w-2xl mx-auto shadow-sm"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-lg">
                <span className="material-symbols-outlined text-[48px] text-primary">event_busy</span>
              </div>
              <h2 className="font-display text-[32px] text-on-surface mb-sm">No events found</h2>
              <p className="font-body-lg mb-lg max-w-[384px] mx-auto">We couldn't find any events matching your current filters. Try adjusting your search.</p>
              <button onClick={() => { setQuery(''); setCategory('All'); }} className="btn-outline w-fit mx-auto rounded-full">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => navigate(`/event/${event.slug}`)}
                  className="card-hover group bg-surface rounded-[24px] overflow-hidden border border-outline-variant cursor-pointer flex flex-col h-full"
                >
                  <div className="h-[220px] relative overflow-hidden bg-surface-variant flex-shrink-0">
                    {event.coverImage ? (
                      <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high group-hover:scale-110 transition-transform duration-700">
                        <span className="material-symbols-outlined text-[48px] text-outline">image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                      {event.date || 'TBA'}
                    </div>
                    <div className="absolute top-4 right-4 bg-surface text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                      {priceLabel(event)}
                    </div>
                  </div>
                  <div className="p-lg flex flex-col flex-grow">
                    <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                      <span className="material-symbols-outlined text-[16px]">{ICONS[(event.category || '').toLowerCase()] || 'category'}</span> {event.category || 'Event'}
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-secondary font-body-sm flex items-center gap-xs mt-auto">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> <span className="truncate">{event.location || 'TBA'}</span>
                    </p>
                    
                    {/* Event Stats row */}
                    <div className="mt-md pt-md border-t border-outline-variant flex items-center justify-between text-secondary">
                      <div className="flex items-center gap-xs text-xs font-medium">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {event.organizerName ? event.organizerName.charAt(0).toUpperCase() : 'O'}
                        </span>
                        <span className="truncate max-w-[120px]">{event.organizerName || 'Organizer'}</span>
                      </div>
                      {event.ticketTiers.length > 0 && (
                        <div className="text-xs font-medium flex items-center gap-xs flex-shrink-0">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          {eventSold(event).toLocaleString()} attending
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
