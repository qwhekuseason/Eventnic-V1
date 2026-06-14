// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { useEvents, uid } from '../contexts/EventsContext';

function Stepper() {
  const steps = ['Event Details', 'Ticket Types', 'Schedule', 'Review'];
  return (
    <nav className="mb-xxl">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
        {steps.map((label, i) => (
          <div key={label} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary text-on-primary' : i === 1 ? 'bg-primary text-on-primary ring-4 ring-primary-fixed shadow-md' : 'bg-surface-container-highest text-secondary'}`}>
              {i === 0 ? <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check</span> : <span className="font-label-md text-label-md">{i + 1}</span>}
            </div>
            <span className={`mt-base font-label-md text-label-md ${i <= 1 ? 'text-primary' : 'text-secondary'}`}>{label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default function CreateEventTicketsEventnic() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useEvents();

  const tiers = draft.ticketTiers;
  const addTier = () => updateDraft({ ticketTiers: [...tiers, { id: uid(), name: '', price: 0, quantity: 0, sold: 0 }] });
  const updateTier = (id, field, value) =>
    updateDraft({ ticketTiers: tiers.map((t) => (t.id === id ? { ...t, [field]: field === 'name' ? value : Number(value) } : t)) });
  const removeTier = (id) => updateDraft({ ticketTiers: tiers.filter((t) => t.id !== id) });

  const handleBack = () => navigate('/create-event/basic-info');
  const handleContinue = () => navigate('/create-event/schedule');

  return (
    <main className="flex-grow max-w-4xl mx-auto w-full px-margin pt-[120px] pb-xxl">
      <Stepper />

      <div className="mb-xl text-center md:text-left">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Ticket Types &amp; Pricing</h1>
        <p className="font-body-md text-body-md text-secondary">Define how attendees can join your event. Add multiple tiers like Early Bird, VIP, or General Admission.</p>
      </div>

      <div className="space-y-md">
        <div className="space-y-md">
          {tiers.length === 0 && (
            <div className="text-center py-xl bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl text-secondary font-body-md">
              No ticket tiers yet. Add your first one below. (Leave empty for a free RSVP-only event.)
            </div>
          )}
          {tiers.map((t) => (
            <div key={t.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm hover:border-primary transition-all group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-end">
                <div className="md:col-span-5">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Ticket Name</label>
                  <input value={t.name} onChange={(e) => updateTier(t.id, 'name', e.target.value)} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" placeholder="e.g. Early Bird" type="text" />
                </div>
                <div className="md:col-span-3">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-secondary font-body-md">$</span>
                    <input value={t.price} onChange={(e) => updateTier(t.id, 'price', e.target.value)} className="w-full h-11 pl-xl pr-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" placeholder="0.00" type="number" min="0" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Quantity</label>
                  <input value={t.quantity} onChange={(e) => updateTier(t.id, 'quantity', e.target.value)} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" placeholder="100" type="number" min="0" />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button onClick={() => removeTier(t.id)} className="w-11 h-11 flex items-center justify-center rounded-lg text-secondary hover:text-error hover:bg-error-container transition-all">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addTier} className="w-full py-xl border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-base text-secondary hover:text-primary hover:border-primary hover:bg-primary-fixed transition-all group">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="font-label-md text-label-md">Add Ticket Tier</span>
          </button>
        </div>

        <div className="mt-xxl flex items-center justify-between pt-lg border-t border-outline-variant">
          <button onClick={handleBack} className="flex items-center gap-sm px-lg py-md border border-outline-variant rounded-lg text-secondary font-bold hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </button>
          <button onClick={handleContinue} className="flex items-center gap-sm px-xl py-md bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-md">
            Continue
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
}
