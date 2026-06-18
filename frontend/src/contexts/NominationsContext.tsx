import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '../config/firebase';
import { uid } from './EventsContext';

export interface NominationSubmission {
  id: string;
  eventId: string;
  categoryId: string;
  nominatorId?: string; // Optional, can be anonymous
  nomineeName: string;
  nomineeDescription: string;
  phone?: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

interface NominationsContextType {
  nominations: NominationSubmission[];
  submitNomination: (data: Omit<NominationSubmission, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateNominationStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  getPendingForEvent: (eventId: string) => NominationSubmission[];
}

const NominationsContext = createContext<NominationsContextType | undefined>(undefined);
const db = getFirestore(app);

export function NominationsProvider({ children }: { children: ReactNode }) {
  const [nominations, setNominations] = useState<NominationSubmission[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'nominations'), (snapshot) => {
      const data: NominationSubmission[] = [];
      snapshot.forEach((doc) => data.push(doc.data() as NominationSubmission));
      setNominations(data.sort((a, b) => b.createdAt - a.createdAt));
    });
    return () => unsubscribe();
  }, []);

  const submitNomination = async (data: Omit<NominationSubmission, 'id' | 'status' | 'createdAt'>) => {
    const id = uid();
    const submission: NominationSubmission = { ...data, id, status: 'pending', createdAt: Date.now() };
    await setDoc(doc(db, 'nominations', id), submission);
  };

  const updateNominationStatus = async (id: string, status: 'approved' | 'rejected') => {
    await updateDoc(doc(db, 'nominations', id), { status });
  };

  const getPendingForEvent = (eventId: string) => 
    nominations.filter(n => n.eventId === eventId && n.status === 'pending');

  return (
    <NominationsContext.Provider value={{ nominations, submitNomination, updateNominationStatus, getPendingForEvent }}>
      {children}
    </NominationsContext.Provider>
  );
}

export function useNominations() {
  const ctx = useContext(NominationsContext);
  if (!ctx) throw new Error('useNominations must be used within NominationsProvider');
  return ctx;
}
