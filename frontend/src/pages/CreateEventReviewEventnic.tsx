// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';

export default function CreateEventReviewEventnic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, createEvent, resetDraft } = useEvents();
  const [agreed, setAgreed] = useState(false);

  const handleBack = () => navigate('/create-event/schedule');

  const handlePublish = () => {
    if (!draft.title.trim()) {
      alert('Your event needs a title. Go back to Basic Info to add one.');
      return;
    }
    if (!agreed) {
      alert('Please confirm the information is accurate before publishing.');
      return;
    }
    createEvent(draft, 'pending', user?.email || 'unknown', user?.name || 'Organizer');
    resetDraft();
    alert('Event submitted! It will go live once an admin approves it.');
    navigate('/dashboard');
  };

  const steps = ['Basic Info', 'Tickets', 'Schedule', 'Review'];

  return (
    <main className="flex-grow pt-[120px]">
      <section className="max-w-4xl mx-auto px-margin">
        <div className="flex items-center justify-between mb-xxl relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0"></div>
          {steps.map((label, i) => (
            <div key={label} className="relative z-10 flex flex-col items-center gap-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 3 ? 'bg-primary ring-4 ring-primary-fixed border-2 border-on-primary text-on-primary' : 'bg-primary text-on-primary'}`}>
                {i === 3 ? '4' : <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>}
              </div>
              <span className={`font-label-sm ${i === 3 ? 'text-primary font-bold' : 'text-secondary'}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Review Your Event</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Check all details before submitting. Your event goes live once an admin approves it.</p>
        </div>

        <div className="space-y-lg mb-xxl">
          {/* Basic info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-start mb-md">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm"><span className="material-symbols-outlined text-primary">info</span> Basic Info</h2>
              <button onClick={() => navigate('/create-event/basic-info')} className="text-primary hover:bg-primary-fixed px-md py-sm rounded-lg transition-all flex items-center gap-xs font-label-md"><span className="material-symbols-outlined !text-[18px]">edit</span> Edit</button>
            </div>
            <div className="flex flex-col md:flex-row gap-lg">
              <div className="w-full md:w-1/3 aspect-video rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                {draft.coverImage ? <img className="w-full h-full object-cover" src={draft.coverImage} alt="Cover" /> : <span className="material-symbols-outlined text-[40px] text-outline">image</span>}
              </div>
              <div className="flex-1 space-y-md">
                <div>
                  <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Event Title</label>
                  <p className="font-headline-sm text-headline-sm">{draft.title || <span className="text-error">Untitled (required)</span>}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Category</label>
                    <span className="inline-flex items-center px-md py-xs bg-secondary-fixed text-on-secondary-fixed font-label-sm rounded-full capitalize">{draft.category || '—'}</span>
                  </div>
                  <div>
                    <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Date &amp; Location</label>
                    <p className="font-body-md text-body-md flex items-center gap-xs"><span className="material-symbols-outlined !text-[18px] text-primary">location_on</span>{[draft.date, draft.location].filter(Boolean).join(' • ') || '—'}</p>
                  </div>
                </div>
                {draft.description && (
                  <div>
                    <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Description</label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">{draft.description}</p>
                  </div>
                )}
                {draft.speakers.length > 0 && (
                  <div>
                    <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Speakers</label>
                    <p className="font-body-sm text-body-sm">{draft.speakers.map((s) => s.name).filter(Boolean).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-start mb-md">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm"><span className="material-symbols-outlined text-primary">confirmation_number</span> Ticket Tiers</h2>
              <button onClick={() => navigate('/create-event/tickets')} className="text-primary hover:bg-primary-fixed px-md py-sm rounded-lg transition-all flex items-center gap-xs font-label-md"><span className="material-symbols-outlined !text-[18px]">edit</span> Edit</button>
            </div>
            {draft.ticketTiers.length === 0 ? (
              <p className="text-on-surface-variant font-body-sm">No paid tiers — free / RSVP-only event.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="text-left font-label-md text-on-surface-variant py-md px-sm">Tier Name</th>
                      <th className="text-left font-label-md text-on-surface-variant py-md px-sm">Price</th>
                      <th className="text-left font-label-md text-on-surface-variant py-md px-sm">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {draft.ticketTiers.map((t) => (
                      <tr key={t.id}>
                        <td className="py-md px-sm font-body-md">{t.name || '—'}</td>
                        <td className="py-md px-sm font-body-md">${Number(t.price).toFixed(2)}</td>
                        <td className="py-md px-sm font-body-md">{t.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Voting */}
          {draft.votingEnabled && draft.votingCategories.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <div className="flex justify-between items-start mb-md">
                <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm"><span className="material-symbols-outlined text-primary">how_to_vote</span> Community Voting</h2>
                <button onClick={() => navigate('/create-event/basic-info')} className="text-primary hover:bg-primary-fixed px-md py-sm rounded-lg transition-all flex items-center gap-xs font-label-md"><span className="material-symbols-outlined !text-[18px]">edit</span> Edit</button>
              </div>
              <div className="space-y-sm">
                {draft.votingCategories.map((c) => (
                  <div key={c.id} className="border-l-4 border-primary pl-md py-xs">
                    <h3 className="font-label-md text-primary">{c.name || 'Untitled category'}</h3>
                    <p className="font-body-sm text-on-surface-variant">{c.nominees.map((n) => n.name).filter(Boolean).join(', ') || 'No nominees'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-start mb-md">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm"><span className="material-symbols-outlined text-primary">calendar_month</span> Event Schedule</h2>
              <button onClick={() => navigate('/create-event/schedule')} className="text-primary hover:bg-primary-fixed px-md py-sm rounded-lg transition-all flex items-center gap-xs font-label-md"><span className="material-symbols-outlined !text-[18px]">edit</span> Edit</button>
            </div>
            {draft.agenda.length === 0 ? (
              <p className="text-on-surface-variant font-body-sm">No agenda items added.</p>
            ) : (
              <div className="space-y-sm">
                {draft.agenda.map((a) => (
                  <div key={a.id} className="flex items-center gap-md bg-surface-container rounded-lg p-md">
                    <span className="font-label-md w-24">{a.start || '—'}</span>
                    <div className="flex-grow">
                      <p className="font-body-md font-bold">{a.title}</p>
                      {a.description && <p className="font-body-sm text-on-surface-variant">{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm + publish */}
          <div className="bg-surface-container-high rounded-xl p-lg border border-outline-variant">
            <div className="flex items-start gap-md mb-lg">
              <div className="flex items-center h-6">
                <input checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-5 w-5 rounded border-outline text-primary focus:ring-primary" id="terms" type="checkbox" />
              </div>
              <div className="text-body-sm">
                <label className="font-medium text-on-surface" htmlFor="terms">I confirm that all information provided is accurate.</label>
                <p className="text-on-surface-variant">By submitting, you agree to Eventnic's <Link className="text-primary underline" to="/terms-of-service">Terms of Service</Link> and <Link className="text-primary underline" to="/privacy-policy">Privacy Policy</Link>.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-md pt-md border-t border-outline-variant">
              <button type="button" onClick={handleBack} className="w-full sm:w-auto px-xl py-md border border-outline-variant bg-surface text-on-surface font-label-md rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Schedule
              </button>
              <button type="button" onClick={handlePublish} className="w-full sm:w-auto px-xxl py-md bg-primary text-on-primary font-headline-sm rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-md">
                Submit Event
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
