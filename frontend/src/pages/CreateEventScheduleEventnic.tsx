// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents, uid } from '../contexts/EventsContext';

function Stepper() {
  const steps = ['Basic Info', 'Tickets', 'Schedule', 'Review'];
  return (
    <div className="mb-xxl max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 w-[66%] h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
        {steps.map((label, i) => (
          <div key={label} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i < 2 ? 'bg-primary text-on-primary shadow-md' : i === 2 ? 'bg-primary text-on-primary shadow-lg ring-4 ring-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
              {i < 2 ? <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check</span> : i + 1}
            </div>
            <span className={`mt-sm font-label-sm text-label-sm ${i <= 2 ? 'text-primary' : 'text-secondary'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreateEventScheduleEventnic() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useEvents();
  const [item, setItem] = useState({ title: '', start: '', end: '', description: '' });

  const agenda = draft.agenda;
  const addItem = () => {
    if (!item.title.trim()) {
      alert('Add a session title first.');
      return;
    }
    updateDraft({ agenda: [...agenda, { id: uid(), ...item }] });
    setItem({ title: '', start: '', end: '', description: '' });
  };
  const removeItem = (id) => updateDraft({ agenda: agenda.filter((a) => a.id !== id) });

  const handleBack = () => navigate('/create-event/tickets');
  const handleContinue = () => navigate('/create-event/review');

  return (
    <main className="flex-grow max-w-container-max mx-auto px-margin pt-[120px] pb-xxl w-full">
      <Stepper />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xxl">
        <div className="lg:col-span-7">
          <header className="mb-xl">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Event Agenda</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Define the timeline for your event. Clear schedules help attendees plan their experience.</p>
          </header>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm space-y-lg">
            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface-variant">Agenda Item Title</label>
              <input value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="e.g. Opening Keynote" type="text" />
            </div>
            <div className="grid grid-cols-2 gap-lg">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface-variant">Start Time</label>
                <input value={item.start} onChange={(e) => setItem({ ...item, start: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all" type="time" />
              </div>
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface-variant">End Time</label>
                <input value={item.end} onChange={(e) => setItem({ ...item, end: e.target.value })} className="w-full h-11 px-md rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all" type="time" />
              </div>
            </div>
            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface-variant">Description</label>
              <textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} className="w-full p-md rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none" placeholder="Briefly describe what happens during this session..." rows={3}></textarea>
            </div>
            <button type="button" onClick={addItem} className="flex items-center justify-center gap-sm w-full py-md rounded-lg border-2 border-dashed border-primary text-primary font-bold hover:bg-primary-fixed transition-all group">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="font-label-md text-label-md">Add Session</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-xl border-t border-outline-variant mt-xl">
          <button onClick={handleBack} className="btn-outline">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back
          </button>
          <button onClick={handleContinue} className="btn-primary">
            Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-[100px]">
            <div className="bg-surface-container-high p-lg rounded-xl border border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                Schedule Preview
              </h3>
              <div className="space-y-md relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
                {agenda.length === 0 && (
                  <div className="relative pl-xl">
                    <div className="border-2 border-dashed border-outline-variant p-md rounded-lg flex items-center justify-center text-on-surface-variant italic font-body-sm">
                      Add sessions to build your agenda...
                    </div>
                  </div>
                )}
                {agenda.map((a) => (
                  <div key={a.id} className="relative pl-xl group">
                    <div className="absolute left-0 top-1 w-[32px] h-[32px] bg-surface border-2 border-primary rounded-full flex items-center justify-center z-10 shadow-sm">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div className="bg-surface p-md rounded-lg border border-outline-variant group-hover:border-primary transition-colors shadow-sm">
                      <div className="flex justify-between items-start mb-xs">
                        <h4 className="font-label-md text-label-md text-on-surface">{a.title}</h4>
                        <button onClick={() => removeItem(a.id)} className="text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                      {(a.start || a.end) && <p className="font-body-sm text-body-sm text-primary font-medium">{a.start}{a.end ? ` - ${a.end}` : ''}</p>}
                      {a.description && <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-lg pt-lg border-t border-outline-variant flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{agenda.length} Session{agenda.length === 1 ? '' : 's'} Added</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
