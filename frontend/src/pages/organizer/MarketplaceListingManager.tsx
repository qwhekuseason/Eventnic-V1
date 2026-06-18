import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMarketplace } from '../../contexts/MarketplaceContext';

export default function MarketplaceListingManager() {
  const { user } = useAuth();
  const { listings, createListing, deleteListing } = useMarketplace();
  
  const myListings = user?.role === 'ADMIN' 
    ? listings 
    : listings.filter(l => l.organizerId === user?.id);
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'venue' as any,
    price: '',
    location: '',
    contactEmail: user?.email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createListing({
        organizerId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        location: formData.location,
        contactEmail: formData.contactEmail
      });
      setIsAdding(false);
      setFormData({ ...formData, title: '', description: '', price: '', location: '' });
    } catch (err) {
      alert('Failed to add listing');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-xl border-b border-outline-variant pb-md">
          <div>
            <h1 className="font-display text-[40px] text-on-surface">Manage Marketplace</h1>
            <p className="text-secondary font-body-lg">Offer your services to other event organizers.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-primary text-white px-lg py-sm rounded-full font-bold hover:bg-tertiary transition-colors"
          >
            {isAdding ? 'Cancel' : 'Add Listing'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-md mb-xl max-w-2xl">
            <h2 className="font-headline-md font-bold mb-lg text-on-surface">New Service Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-2 gap-md">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-xs">Service Title</label>
                  <input required type="text" className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Grand Ballroom or Pro Photographer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-xs">Category</label>
                  <select required className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="venue">Venue</option>
                    <option value="photography">Photography</option>
                    <option value="catering">Catering</option>
                    <option value="mc">MC/Host</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-xs">Starting Price ($)</label>
                  <input required type="number" min="0" className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-xs">Location</label>
                  <input required type="text" className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-xs">Contact Email</label>
                  <input required type="email" className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-xs">Description</label>
                  <textarea required className="w-full bg-background border border-outline-variant rounded-xl p-sm outline-none focus:border-primary h-24 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-sm rounded-xl transition-colors">Publish Listing</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {myListings.length === 0 && !isAdding && (
            <p className="text-secondary py-lg">You have not created any marketplace listings.</p>
          )}
          {myListings.map(listing => (
            <div key={listing.id} className="bg-surface border border-outline-variant rounded-2xl p-md flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-sm">
                <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{listing.category}</span>
                <button onClick={() => { if(window.confirm('Delete this listing?')) deleteListing(listing.id); }} className="text-red-500 hover:text-red-700">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
              <h3 className="font-bold text-on-surface text-lg mb-xs">{listing.title}</h3>
              <p className="text-secondary text-sm mb-md flex-1">{listing.description}</p>
              <div className="pt-sm border-t border-outline-variant flex justify-between items-center text-sm font-bold">
                <span>${listing.price.toLocaleString()}</span>
                <span className="text-secondary">{listing.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
