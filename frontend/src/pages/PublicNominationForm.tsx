import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { useNominations } from '../contexts/NominationsContext';

export default function PublicNominationForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getEvent } = useEvents();
  const { submitNomination } = useNominations();
  
  const event = getEvent(slug || '');
  
  const [categoryId, setCategoryId] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDescription, setNomineeDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !nomineeName) return;
    
    setIsSubmitting(true);
    try {
      await submitNomination({
        eventId: event.id,
        categoryId,
        nomineeName,
        nomineeDescription,
        phone,
        imageUrl,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit nomination');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin flex items-center justify-center">
        <div className="bg-surface border border-outline-variant rounded-[24px] p-xl max-w-lg w-full text-center shadow-xl">
          <span className="material-symbols-outlined text-[64px] text-emerald-500 mb-md block">task_alt</span>
          <h2 className="font-display text-[32px] text-on-surface mb-sm">Nomination Submitted!</h2>
          <p className="font-body-md text-secondary mb-xl">
            Thank you for submitting your nomination. The organizers will review it shortly.
          </p>
          <button 
            onClick={() => navigate(`/event/${event.slug}`)}
            className="bg-primary text-white font-bold px-lg py-sm rounded-full w-full hover:bg-tertiary transition-colors"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-xl mx-auto">
        <Link to={`/event/${event.slug}`} className="flex items-center gap-xs text-primary font-bold hover:underline mb-lg">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to Event
        </Link>
        
        <div className="bg-surface border border-outline-variant rounded-[24px] p-xl shadow-xl">
          <h1 className="font-display text-[32px] text-on-surface mb-xs">Submit a Nomination</h1>
          <p className="font-body-md text-secondary mb-xl">For {event.title}</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <div>
              <label className="block font-label-md font-bold text-on-surface mb-xs">Category</label>
              <select 
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary transition-colors"
              >
                <option value="" disabled>Select a category</option>
                {event.votingCategories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block font-label-md font-bold text-on-surface mb-xs">Nominee Name</label>
              <input 
                type="text" 
                required
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Enter the nominee's full name"
                className="w-full bg-background border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <label className="block font-label-md font-bold text-on-surface mb-xs">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-label-md font-bold text-on-surface mb-xs">Picture URL (Optional)</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-background border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-label-md font-bold text-on-surface mb-xs">Why should they win? (Optional)</label>
              <textarea 
                value={nomineeDescription}
                onChange={(e) => setNomineeDescription(e.target.value)}
                placeholder="Briefly describe why you are nominating them..."
                className="w-full h-[120px] bg-background border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-white font-bold px-lg py-md rounded-full shadow-lg hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
