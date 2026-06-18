import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { app } from '../config/firebase';
import { uid } from './EventsContext';

export interface MarketplaceListing {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: 'venue' | 'photography' | 'catering' | 'mc' | 'other';
  price: number;
  location: string;
  contactEmail: string;
  createdAt: number;
}

interface MarketplaceContextType {
  listings: MarketplaceListing[];
  createListing: (data: Omit<MarketplaceListing, 'id' | 'createdAt'>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);
const db = getFirestore(app);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'marketplace'), (snapshot) => {
      const data: MarketplaceListing[] = [];
      snapshot.forEach((doc) => data.push(doc.data() as MarketplaceListing));
      setListings(data.sort((a, b) => b.createdAt - a.createdAt));
    });
    return () => unsubscribe();
  }, []);

  const createListing = async (data: Omit<MarketplaceListing, 'id' | 'createdAt'>) => {
    const id = uid();
    const listing: MarketplaceListing = { ...data, id, createdAt: Date.now() };
    await setDoc(doc(db, 'marketplace', id), listing);
  };

  const deleteListing = async (id: string) => {
    await deleteDoc(doc(db, 'marketplace', id));
  };

  return (
    <MarketplaceContext.Provider value={{ listings, createListing, deleteListing }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return ctx;
}
