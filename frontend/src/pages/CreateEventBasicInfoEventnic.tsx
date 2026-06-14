// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, uid } from '../contexts/EventsContext';

function Stepper() {
  const steps = ['Basic Info', 'Tickets', 'Schedule', 'Review'];
  return (
    <div className="mb-xxl max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -z-10 -translate-y-1/2"></div>
        {steps.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-xs bg-background px-xs">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-highest text-secondary'}`}>{i + 1}</div>
            <span className={`font-label-md text-label-md ${i === 0 ? 'text-primary' : 'text-secondary'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreateEventBasicInfoEventnic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, updateDraft, createEvent, resetDraft } = useEvents();

  const set = (patch) => updateDraft(patch);

  // ---- Speakers ----
  const addSpeaker = () => set({ speakers: [...draft.speakers, { id: uid(), name: '', title: '' }] });
  const updateSpeaker = (id, field, value) =>
    set({ speakers: draft.speakers.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });
  const removeSpeaker = (id) => set({ speakers: draft.speakers.filter((s) => s.id !== id) });

  // ---- Voting ----
  const addCategory = () =>
    set({ votingCategories: [...draft.votingCategories, { id: uid(), name: '', nominees: [{ id: uid(), name: '', description: '', votes: 0 }] }] });
  const updateCategory = (id, name) =>
    set({ votingCategories: draft.votingCategories.map((c) => (c.id === id ? { ...c, name } : c)) });
  const removeCategory = (id) => set({ votingCategories: draft.votingCategories.filter((c) => c.id !== id) });
  const addNominee = (catId) =>
    set({
      votingCategories: draft.votingCategories.map((c) =>
        c.id === catId ? { ...c, nominees: [...c.nominees, { id: uid(), name: '', description: '', votes: 0 }] } : c,
      ),
    });
  const updateNominee = (catId, nomId, field, value) =>
    set({
      votingCategories: draft.votingCategories.map((c) =>
        c.id === catId ? { ...c, nominees: c.nominees.map((n) => (n.id === nomId ? { ...n, [field]: value } : n)) } : c,
      ),
    });
  const removeNominee = (catId, nomId) =>
    set({
      votingCategories: draft.votingCategories.map((c) =>
        c.id === catId ? { ...c, nominees: c.nominees.filter((n) => n.id !== nomId) } : c,
      ),
    });

  const onCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ coverImage: reader.result });
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    if (!draft.title.trim()) {
      alert('Please add an event title before saving.');
      return;
    }
    createEvent(draft, 'draft', user?.email || 'unknown', user?.name || 'Organizer');
    resetDraft();
    navigate('/dashboard');
  };

  const toggleVoting = () => set({ votingEnabled: !draft.votingEnabled, votingCategories: !draft.votingEnabled && draft.votingCategories.length === 0 ? [{ id: uid(), name: '', nominees: [{ id: uid(), name: '', description: '', votes: 0 }] }] : draft.votingCategories });

  return (
    <main className="flex-grow max-w-container-max mx-auto px-margin pt-[120px] pb-xxl w-full">
      <Stepper />
      <div className="max-w-4xl mx-auto">
        <div className="mb-xl flex items-center gap-md">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-xs text-secondary hover:text-primary cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="font-label-md text-label-md">Back to Dashboard</span>
          </button>
        </div>
        <h1 className="font-headline-lg text-headline-lg mb-md text-on-surface">Step 1: Basic Information</h1>
        <p className="text-body-lg text-secondary mb-xl">Tell us the core details about your event to get started.</p>

        <div className="space-y-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm">

            <div className="md:col-span-2 space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Event Title</label>
              <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md" placeholder="e.g. Annual Tech Symposium 2024" type="text" />
            </div>

            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Category</label>
              <select value={draft.category} onChange={(e) => set({ category: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md appearance-none bg-white">
                <option value="">Select a category</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="concert">Concert</option>
                <option value="networking">Networking</option>
                <option value="exhibition">Exhibition</option>
              </select>
            </div>

            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Location Type</label>
              <select value={draft.locationType} onChange={(e) => set({ locationType: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md appearance-none bg-white">
                <option value="physical">Physical Venue</option>
                <option value="online">Online / Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">{draft.locationType === 'online' ? 'Event Link / Platform' : 'Venue / Location'}</label>
              <input value={draft.location} onChange={(e) => set({ location: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md" placeholder={draft.locationType === 'online' ? 'e.g. Zoom / YouTube Live' : 'e.g. San Francisco Convention Center'} type="text" />
            </div>

            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Event Date</label>
              <input value={draft.date} onChange={(e) => set({ date: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md" type="date" />
            </div>

            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Start Time</label>
              <input value={draft.time} onChange={(e) => set({ time: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md" type="time" />
            </div>

            <div className="md:col-span-2 space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Description</label>
              <textarea value={draft.description} onChange={(e) => set({ description: e.target.value })} className="w-full px-md py-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md resize-none" placeholder="Describe what attendees can expect from your event..." rows={5}></textarea>
            </div>

            <div className="md:col-span-2 space-y-xs">
              <label className="font-label-md text-label-md text-on-surface">Event Cover Image</label>
              <label className="relative group cursor-pointer block">
                <input type="file" accept="image/*" onChange={onCover} className="sr-only" />
                <div className="w-full h-[240px] rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-md hover:bg-surface-container-highest transition-all overflow-hidden">
                  {draft.coverImage ? (
                    <img alt="Cover" className="absolute inset-0 w-full h-full object-cover" src={draft.coverImage} />
                  ) : null}
                  <div className="z-10 flex flex-col items-center bg-surface-container-low/70 rounded-lg px-md py-sm">
                    <span className="material-symbols-outlined text-[48px] text-secondary group-hover:text-primary transition-colors">cloud_upload</span>
                    <p className="font-label-md text-label-md text-secondary mt-sm">{draft.coverImage ? 'Click to replace image' : 'Click to upload'}</p>
                    <p className="font-body-sm text-body-sm text-outline">Recommended: 1600 x 900px</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Speakers */}
            <div className="md:col-span-2 pt-xl border-t border-outline-variant space-y-md">
              <div>
                <h3 className="font-headline-sm text-on-surface">Event Speakers</h3>
                <p className="text-secondary font-body-sm">Add the visionaries and leaders speaking at your event.</p>
              </div>
              <div className="space-y-sm">
                {draft.speakers.map((s) => (
                  <div key={s.id} className="flex items-center gap-md bg-surface p-md rounded-lg border border-outline-variant">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden shrink-0">
                      <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary">person</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-md">
                      <input value={s.name} onChange={(e) => updateSpeaker(s.id, 'name', e.target.value)} className="w-full h-10 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-body-sm" placeholder="Speaker Name" type="text" />
                      <input value={s.title} onChange={(e) => updateSpeaker(s.id, 'title', e.target.value)} className="w-full h-10 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-body-sm" placeholder="Title / Role" type="text" />
                    </div>
                    <button type="button" onClick={() => removeSpeaker(s.id)} className="text-secondary hover:text-error transition-colors p-sm">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addSpeaker} className="flex items-center gap-xs text-primary font-bold font-label-md hover:bg-primary-container px-md py-sm rounded-lg transition-colors w-fit">
                  <span className="material-symbols-outlined text-[18px]">add</span> Add Speaker
                </button>
              </div>
            </div>

            {/* Community Voting / Awards */}
            <div className="md:col-span-2 pt-xl border-t border-outline-variant space-y-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline-sm text-on-surface">Community Voting / Awards</h3>
                  <p className="text-secondary font-body-sm">Enable live voting for categories like "Startup of the Year". No account required for voters.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-sm">
                  <input type="checkbox" className="sr-only peer" checked={draft.votingEnabled} onChange={toggleVoting} />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {draft.votingEnabled && (
                <div className="space-y-md">
                  {draft.votingCategories.map((cat) => (
                    <div key={cat.id} className="bg-surface-container-low p-lg rounded-xl border border-primary/20 space-y-md">
                      <div className="flex items-center justify-between">
                        <input value={cat.name} onChange={(e) => updateCategory(cat.id, e.target.value)} className="font-headline-sm text-on-surface font-bold bg-transparent border-b border-outline-variant hover:border-primary focus:border-primary outline-none transition-colors w-full sm:w-1/2 pb-xs" type="text" placeholder="Category Name (e.g. Startup of the Year)" />
                        <button type="button" onClick={() => removeCategory(cat.id)} className="text-secondary hover:text-error transition-colors ml-sm"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                      <div className="space-y-sm pl-md border-l-2 border-outline-variant">
                        {cat.nominees.map((nom) => (
                          <div key={nom.id} className="flex flex-col sm:flex-row items-center gap-md">
                            <input value={nom.name} onChange={(e) => updateNominee(cat.id, nom.id, 'name', e.target.value)} className="w-full sm:flex-1 h-10 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-body-sm" placeholder="Nominee Name" type="text" />
                            <input value={nom.description} onChange={(e) => updateNominee(cat.id, nom.id, 'description', e.target.value)} className="w-full sm:flex-1 h-10 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-body-sm" placeholder="Short Description" type="text" />
                            <button type="button" onClick={() => removeNominee(cat.id, nom.id)} className="text-secondary hover:text-error transition-colors p-sm self-end sm:self-auto">
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addNominee(cat.id)} className="flex items-center gap-xs text-primary font-bold font-label-md hover:underline pt-xs">
                          <span className="material-symbols-outlined text-[16px]">add</span> Add Nominee
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addCategory} className="mt-sm flex items-center gap-xs text-on-surface font-bold font-label-md border border-outline-variant hover:bg-surface-container px-md py-sm rounded-lg transition-colors w-full justify-center">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Another Voting Category
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-md pt-xl border-t border-outline-variant">
            <button onClick={saveDraft} className="px-xl h-11 border border-outline-variant rounded-lg text-secondary font-label-md hover:bg-surface-container-low cursor-pointer transition-all" type="button">Save Draft</button>
            <button onClick={() => navigate('/create-event/tickets')} className="px-xxl h-11 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 shadow-md cursor-pointer transition-all active:scale-[0.98]" type="button">Continue</button>
          </div>
        </div>
      </div>
    </main>
  );
}
