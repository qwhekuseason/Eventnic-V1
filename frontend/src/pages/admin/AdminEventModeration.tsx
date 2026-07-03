import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents, eventCapacity } from '../../contexts/EventsContext';

type Filter = 'all' | 'pending' | 'published' | 'rejected';

export default function AdminEventModeration() {
  const [filter, setFilter] = useState<Filter>('all');
  const { events, approveEvent, rejectEvent, updateEvent } = useEvents();

  const visible = events.filter((e) => e.status !== 'draft');
  const filtered = visible.filter((e) => filter === 'all' || e.status === filter);

  const counts = {
    pending: visible.filter((e) => e.status === 'pending').length,
    published: visible.filter((e) => e.status === 'published').length,
    rejected: visible.filter((e) => e.status === 'rejected').length,
  };

  const statusLabel = (s: string) => (s === 'published' ? 'approved' : s);

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Link to="/admin" className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="font-display text-[36px] text-on-surface leading-tight">Event Moderation</h1>
            </div>
            <p className="text-secondary font-body-lg">Review, approve, or reject event submissions.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
          <div className="bg-amber-500/10 rounded-2xl p-lg border border-amber-500/30 shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-amber-200 text-amber-600 dark:text-amber-400 flex items-center justify-center"><span className="material-symbols-outlined">hourglass_top</span></div>
            <div>
              <div className="font-display text-[28px] text-amber-600 dark:text-amber-400">{counts.pending}</div>
              <div className="text-amber-600 font-body-sm font-medium">Pending Review</div>
            </div>
          </div>
          <div className="bg-emerald-500/10 rounded-2xl p-lg border border-emerald-500/30 shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-green-200 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><span className="material-symbols-outlined">check_circle</span></div>
            <div>
              <div className="font-display text-[28px] text-emerald-600 dark:text-emerald-400">{counts.published}</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-body-sm font-medium">Approved</div>
            </div>
          </div>
          <div className="bg-error-container rounded-2xl p-lg border border-error/30 shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-red-200 text-on-error-container flex items-center justify-center"><span className="material-symbols-outlined">cancel</span></div>
            <div>
              <div className="font-display text-[28px] text-on-error-container">{counts.rejected}</div>
              <div className="text-error font-body-sm font-medium">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-sm mb-lg flex-wrap">
          {(['all', 'pending', 'published', 'rejected'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-md py-sm rounded-full font-label-md font-bold transition-all capitalize ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline-variant text-secondary hover:border-primary'}`}
            >
              {f === 'all' ? 'All Events' : f === 'published' ? 'Approved' : f}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-md">
          {filtered.length === 0 && <div className="bg-surface rounded-2xl border border-outline-variant p-xl text-center text-secondary">No events in this view.</div>}
          {filtered.map((event) => (
            <div key={event.id} className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg flex flex-col md:flex-row md:items-center justify-between gap-md hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-xs">
                  <h3 className="font-bold text-on-surface text-lg">{event.title}</h3>
                  <span className={`px-sm py-xs rounded-full font-label-sm text-xs font-bold capitalize ${event.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:text-amber-400 border border-amber-500/30' : event.status === 'published' ? 'bg-green-100 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-100 text-on-error-container border border-error/30'}`}>
                    {statusLabel(event.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-lg text-secondary font-body-sm">
                  <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">person</span> {event.organizerName}</span>
                  <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {event.date || 'TBD'}</span>
                  <span className="flex items-center gap-xs capitalize"><span className="material-symbols-outlined text-[16px]">category</span> {event.category || '—'}</span>
                  <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">confirmation_number</span> {eventCapacity(event).toLocaleString()} tickets</span>
                </div>
              </div>
              <div className="flex gap-sm">
                {event.status === 'pending' ? (
                  <>
                    <button onClick={() => rejectEvent(event.id)} className="px-md py-sm rounded-xl border border-red-300 text-error font-bold font-label-md hover:bg-error-container transition-colors">Reject</button>
                    <button onClick={() => approveEvent(event.id)} className="px-md py-sm rounded-xl bg-primary text-white font-bold font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">Approve</button>
                  </>
                ) : (
                  <button onClick={() => updateEvent(event.id, { status: 'pending' })} className="px-md py-sm rounded-xl border border-outline-variant text-secondary font-bold font-label-md hover:border-primary hover:text-primary transition-colors">Reset</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
