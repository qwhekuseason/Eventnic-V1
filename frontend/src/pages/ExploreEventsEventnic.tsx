// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventsContext';

const CATEGORIES = ['All', 'Conference', 'Workshop', 'Concert', 'Networking', 'Exhibition'];
const ICONS = { conference: 'category', workshop: 'draw', concert: 'music_note', networking: 'groups', exhibition: 'storefront' };

const priceLabel = (e) => {
  if (!e.ticketTiers.length) return 'Free';
  const prices = e.ticketTiers.map((t) => Number(t.price)).filter((p) => p > 0);
  if (prices.length === 0) return 'Free';
  const min = Math.min(...prices);
  return e.ticketTiers.length > 1 ? `From $${min.toLocaleString()}` : `$${min.toLocaleString()}`;
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
      <section className="relative pt-[160px] pb-[80px] overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute bottom-0 -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[100px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-md">
              Explore <span className="text-tertiary">Events</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[640px] mx-auto mb-xl">
              Discover conferences, festivals, workshops and more happening around the world.
            </p>
            <div className="glass-panel-dark max-w-[640px] mx-auto rounded-full p-2 flex items-center shadow-2xl">
              <span className="material-symbols-outlined text-white/50 ml-md mr-sm">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by name, location, or category..."
                className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 font-body-md"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="flex flex-wrap gap-sm mb-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-lg py-sm rounded-full font-label-md text-label-md transition-all ${
                  category === cat
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-low text-secondary border border-outline-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-xl">
            <p className="text-secondary font-body-md">
              Showing <span className="text-on-surface font-bold">{filtered.length}</span> event{filtered.length === 1 ? '' : 's'}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-xxl text-secondary">
              <span className="material-symbols-outlined text-[48px] mb-sm block">event_busy</span>
              No events match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  onClick={() => navigate(`/event/${event.slug}`)}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-[220px] relative overflow-hidden bg-surface-variant">
                    {event.coverImage ? (
                      <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-[48px] text-outline">image</span></div>
                    )}
                    <div className="absolute top-4 left-4 glass-panel text-white px-sm py-xs rounded-lg font-bold text-sm backdrop-blur-md">
                      {event.date || 'TBA'}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-on-surface px-sm py-xs rounded-full font-bold text-sm shadow-md">
                      {priceLabel(event)}
                    </div>
                  </div>
                  <div className="p-lg">
                    <div className="flex items-center gap-xs text-primary font-label-sm uppercase tracking-wider mb-sm">
                      <span className="material-symbols-outlined text-[16px]">{ICONS[event.category] || 'category'}</span> {event.category || 'Event'}
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-secondary font-body-sm flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> {event.location || 'TBA'}
                    </p>
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
