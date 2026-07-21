import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { EventRecord } from '../contexts/EventsContext';
import { eventCapacity, eventSold, eventRevenue } from '../contexts/EventsContext';

interface EventDetailsModalProps {
  event: EventRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const totalSold = eventSold(event);
  const capacity = eventCapacity(event);
  const revenue = eventRevenue(event);

  const statusBadge = (s: string) => {
    if (s === 'published')
      return (
        <span className="px-md py-xs rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Approved / Live
        </span>
      );
    if (s === 'pending')
      return (
        <span className="px-md py-xs rounded-full bg-amber-100 text-amber-700 font-bold text-xs border border-amber-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pending Review
        </span>
      );
    if (s === 'rejected')
      return (
        <span className="px-md py-xs rounded-full bg-red-100 text-red-700 font-bold text-xs border border-red-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected
        </span>
      );
    return (
      <span className="px-md py-xs rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs border border-outline-variant">
        Draft
      </span>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-md sm:p-lg overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-surface border border-outline-variant rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative h-48 sm:h-64 bg-surface-container-high overflow-hidden shrink-0">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-premium flex items-center justify-center text-white/40">
                <span className="material-symbols-outlined text-[64px]">event</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-all z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-md text-white z-10">
              <div>
                <div className="flex items-center gap-xs mb-xs flex-wrap">
                  {statusBadge(event.status)}
                  <span className="px-md py-xs rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-md">
                    {event.category || 'General'}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
                  {event.title}
                </h2>
              </div>
              <Link
                to={`/event/${event.slug}`}
                target="_blank"
                className="inline-flex items-center gap-xs bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-md py-2 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span> Public Page
              </Link>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl">
                <div className="text-secondary text-xs font-medium uppercase mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span> Date
                </div>
                <div className="font-bold text-on-surface text-sm">{event.date || 'TBD'}</div>
                <div className="text-secondary text-xs">{event.time || ''}</div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl">
                <div className="text-secondary text-xs font-medium uppercase mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span> Location
                </div>
                <div className="font-bold text-on-surface text-sm truncate">{event.location || 'Online / TBD'}</div>
                <div className="text-secondary text-xs capitalize">{event.locationType || 'Venue'}</div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl">
                <div className="text-secondary text-xs font-medium uppercase mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">confirmation_number</span> Sold / Capacity
                </div>
                <div className="font-bold text-on-surface text-sm">{totalSold} / {capacity}</div>
                <div className="text-secondary text-xs">tickets</div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl">
                <div className="text-secondary text-xs font-medium uppercase mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">payments</span> Revenue
                </div>
                <div className="font-bold text-on-surface text-sm">GH₵ {revenue.toLocaleString()}</div>
                <div className="text-secondary text-xs">gross sales</div>
              </div>
            </div>

            {/* Organizer Details */}
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-2xl flex items-center justify-between flex-wrap gap-md">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <div className="text-xs text-secondary font-medium">Organizer Info</div>
                  <div className="font-bold text-on-surface text-sm">{event.organizerName || 'Unknown Organizer'}</div>
                  <div className="text-xs text-secondary">{event.organizerEmail}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span> Event Description
              </h3>
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl text-on-surface text-sm leading-relaxed whitespace-pre-line">
                {event.description || 'No description provided.'}
              </div>
            </div>

            {/* Ticket Tiers */}
            <div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">confirmation_number</span> Ticket Tiers &amp; Pricing
              </h3>
              {(!event.ticketTiers || event.ticketTiers.length === 0) ? (
                <p className="text-secondary text-sm">Free / RSVP event (No paid tiers).</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-outline-variant">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-surface-container-lowest border-b border-outline-variant text-secondary text-xs font-bold uppercase">
                      <tr>
                        <th className="p-md">Tier Name</th>
                        <th className="p-md">Admits</th>
                        <th className="p-md">Price</th>
                        <th className="p-md">Quantity</th>
                        <th className="p-md">Sold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant bg-surface">
                      {event.ticketTiers.map((t) => (
                        <tr key={t.id}>
                          <td className="p-md font-bold text-on-surface">{t.name}</td>
                          <td className="p-md text-secondary">
                            {t.admitsCount || 1} {(t.admitsCount || 1) === 1 ? 'person' : 'people'}
                          </td>
                          <td className="p-md font-semibold text-primary">GH₵ {Number(t.price).toLocaleString()}</td>
                          <td className="p-md text-secondary">{t.quantity}</td>
                          <td className="p-md text-secondary">{t.sold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Agenda / Schedule */}
            {event.agenda && event.agenda.length > 0 && (
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span> Agenda &amp; Schedule
                </h3>
                <div className="space-y-sm">
                  {event.agenda.map((item) => (
                    <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex items-start gap-md">
                      <div className="bg-primary/10 text-primary px-sm py-1 rounded-lg text-xs font-bold shrink-0">
                        {item.start} - {item.end}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-sm">{item.title}</div>
                        {item.description && <div className="text-secondary text-xs mt-1">{item.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">mic</span> Speakers &amp; Presenters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  {event.speakers.map((sp) => (
                    <div key={sp.id} className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex items-center gap-md">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center shrink-0">
                        {sp.imageUrl ? <img src={sp.imageUrl} alt={sp.name} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-secondary">person</span>}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-sm">{sp.name}</div>
                        <div className="text-secondary text-xs">{sp.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Categories */}
            {event.votingEnabled && event.votingCategories && event.votingCategories.length > 0 && (
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">how_to_vote</span> Live Voting &amp; Awards
                </h3>
                <div className="space-y-md">
                  {event.votingCategories.map((cat) => (
                    <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl">
                      <div className="font-bold text-on-surface text-sm mb-sm">{cat.name}</div>
                      <div className="flex flex-wrap gap-xs">
                        {cat.nominees.map((nom) => (
                          <span key={nom.id} className="px-md py-1 rounded-full bg-surface border border-outline-variant text-xs text-on-surface flex items-center gap-1">
                            <strong>{nom.name}</strong> ({nom.votes || 0} votes)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-6 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between gap-md shrink-0 flex-wrap">
            <button
              onClick={onClose}
              className="px-lg py-sm rounded-xl border border-outline-variant font-bold text-secondary hover:bg-surface-container transition-colors text-sm"
            >
              Close
            </button>

            <div className="flex items-center gap-sm">
              {onReject && (
                <button
                  onClick={() => {
                    onReject(event.id);
                    onClose();
                  }}
                  className="px-lg py-sm rounded-xl border border-red-300 text-error font-bold hover:bg-error-container transition-colors text-sm"
                >
                  Reject Event
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => {
                    onApprove(event.id);
                    onClose();
                  }}
                  className="px-xl py-sm rounded-xl bg-primary text-white font-bold hover:bg-primary-container shadow-md transition-all active:scale-95 text-sm"
                >
                  Approve Live
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
