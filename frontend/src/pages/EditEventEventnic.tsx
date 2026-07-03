import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';

export default function EditEventEventnic() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEvent, updateEvent } = useEvents();

  const event = getEvent(slug || '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('physical');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setLocation(event.location || '');
      setLocationType(event.locationType || 'physical');
    }
  }, [event]);

  if (!event) {
    return <div className="min-h-screen pt-[120px] text-center">Event not found.</div>;
  }

  // Security check: Only the organizer or an admin can edit
  if (user?.role !== 'ADMIN' && user?.email !== event.organizerEmail) {
    return <div className="min-h-screen pt-[120px] text-center">You do not have permission to edit this event.</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateEvent(event.id, {
        title,
        description,
        date,
        time,
        location,
        locationType
      });
      alert('Event updated successfully!');
      navigate(`/event-analytics`); // Can't easily navigate directly to the specific event's analytics since that page uses its own selector, but we'll take them to the dashboard
    } catch (err) {
      console.error(err);
      alert('Failed to update event.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-3xl mx-auto bg-surface border border-outline-variant rounded-3xl p-xl shadow-sm">
        <div className="flex items-center gap-md mb-xl">
          <Link to="/event-analytics" className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full bg-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-[32px] text-on-surface">Edit Event</h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-lg">
          <div>
            <label className="block font-label-md text-on-surface mb-xs">Event Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-xs">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block font-label-md text-on-surface mb-xs">Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-xs">Time</label>
              <input 
                type="time" 
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md items-start">
            <div>
              <label className="block font-label-md text-on-surface mb-xs">Location Type</label>
              <div className="relative">
                <select 
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="physical">Physical Venue</option>
                  <option value="online">Online / Virtual</option>
                  <option value="tba">To Be Announced (TBA)</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-secondary pointer-events-none">expand_more</span>
              </div>
            </div>
            {locationType !== 'tba' && (
              <div>
                <label className="block font-label-md text-on-surface mb-xs">
                  {locationType === 'online' ? 'Meeting Link' : 'Venue Address'}
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required={locationType !== 'tba'}
                  placeholder={locationType === 'online' ? 'https://zoom.us/...' : '123 Main St...'}
                  className="w-full bg-background border border-outline-variant rounded-xl px-md py-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-lg border-t border-outline-variant pt-lg">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold px-xl py-md rounded-xl shadow-sm transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
