import { useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';

export default function Marketplace() {
  const { listings } = useMarketplace();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter(l => {
    if (filterCategory !== 'all' && l.category !== filterCategory) return false;
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) && !l.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-xxl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-xl">
          <h1 className="font-display text-[48px] text-on-surface mb-sm">Event Marketplace</h1>
          <p className="font-body-lg text-secondary max-w-2xl mx-auto">
            Find the perfect venue, photographer, caterer, or MC for your next event. Direct connections, zero middleman fees.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-md mb-xl justify-between items-center bg-surface border border-outline-variant p-md rounded-2xl shadow-sm">
          <div className="flex gap-sm overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {['all', 'venue', 'photography', 'catering', 'mc', 'other'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-lg py-sm rounded-full font-bold text-sm capitalize whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-primary text-white' : 'bg-surface-variant text-secondary hover:bg-outline-variant'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-secondary">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-background border border-outline-variant rounded-full text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-xxl text-secondary">
              <span className="material-symbols-outlined text-[48px] mb-md opacity-50 block">search_off</span>
              No listings found matching your criteria.
            </div>
          ) : (
            filteredListings.map(listing => (
              <div key={listing.id} className="bg-surface border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                <div className="h-48 hero-section relative flex items-center justify-center">
                   <span className="material-symbols-outlined text-[64px] text-white/50">
                    {listing.category === 'venue' ? 'domain' : listing.category === 'photography' ? 'camera_alt' : listing.category === 'catering' ? 'restaurant' : listing.category === 'mc' ? 'mic' : 'star'}
                   </span>
                   <div className="absolute top-md right-md bg-white/90 backdrop-blur text-on-surface px-sm py-xs rounded-lg font-bold text-sm">
                     GH₵ {listing.price.toLocaleString()}
                   </div>
                </div>
                <div className="p-lg flex flex-col flex-1">
                  <div className="flex items-center gap-xs text-xs text-primary font-bold uppercase tracking-wider mb-xs">
                    {listing.category}
                  </div>
                  <h3 className="font-headline-sm font-bold text-on-surface mb-sm">{listing.title}</h3>
                  <div className="flex items-center gap-xs text-secondary text-sm mb-md">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {listing.location}
                  </div>
                  <p className="text-secondary font-body-sm line-clamp-3 mb-lg flex-1">
                    {listing.description}
                  </p>
                  <a 
                    href={`mailto:${listing.contactEmail}?subject=Inquiry regarding: ${listing.title}`}
                    className="block w-full text-center bg-primary/10 text-primary font-bold py-sm rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    Contact Vendor
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
