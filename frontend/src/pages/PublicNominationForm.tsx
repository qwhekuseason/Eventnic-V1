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
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      let uploadedImageUrl = '';
      if (imageFile) {
        uploadedImageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(imageFile);
        });
      }

      await submitNomination({
        eventId: event.id,
        categoryId,
        nomineeName,
        nomineeDescription,
        phone,
        email,
        imageUrl: uploadedImageUrl,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit nomination:', err);
      alert('Failed to submit nomination. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-[140px] pb-xxl px-margin relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[512px] mx-auto relative z-10">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-xl shadow-lg backdrop-blur-xl text-center w-full">
            <span className="material-symbols-outlined text-[64px] text-emerald-500 mb-md block">task_alt</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Nomination Submitted!</h2>
            <p className="font-body-md text-secondary mb-xl">
              Thank you for submitting your nomination. The organizers will review it shortly.
            </p>
            <button 
              onClick={() => navigate(`/event/${event.slug}`)}
              className="bg-primary text-on-primary font-bold px-lg py-md rounded-xl shadow-md hover:shadow-lg transition-all w-full"
            >
              Back to Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[140px] pb-xxl px-margin relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <Link to={`/event/${event.slug}`} className="inline-flex items-center gap-xs text-primary font-label-md hover:opacity-80 transition-opacity mb-xl bg-primary/10 px-md py-xs rounded-full">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Event
        </Link>
        
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-xl shadow-lg backdrop-blur-xl w-full">
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-[32px] text-primary">campaign</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Submit a Nomination</h1>
            <p className="font-body-md text-secondary">Nominate outstanding individuals for <strong>{event.title}</strong></p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
            <div className="space-y-md">
              <h3 className="font-label-lg text-on-surface border-b border-surface-container-high pb-xs">Nomination Details</h3>
              
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-xs">Category <span className="text-error">*</span></label>
                <div className="relative">
                  <select 
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-md py-md text-on-surface appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="" disabled>Select the award category</option>
                    {event.votingCategories?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-xs">Nominee Full Name <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  required
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-md py-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-xs">Nominee Email Address <span className="text-error">*</span></label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nominee@example.com"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-md py-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-xs">Contact Phone (Optional)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-md py-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-on-surface-variant mb-xs">Profile Picture (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-surface border border-outline-variant rounded-xl px-md py-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-xs">Why do they deserve to win? (Optional)</label>
                <textarea 
                  value={nomineeDescription}
                  onChange={(e) => setNomineeDescription(e.target.value)}
                  placeholder="Share a brief story of their impact and achievements..."
                  className="w-full h-[120px] bg-surface border border-outline-variant rounded-xl px-md py-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || !categoryId || !nomineeName || !email}
              className="bg-primary text-on-primary font-bold px-lg py-md rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-sm mt-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : 'Submit Nomination'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
