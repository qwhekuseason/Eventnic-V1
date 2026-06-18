import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from '../config/firebase';

export type EventStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  imageUrl?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

export interface Nominee {
  id: string;
  name: string;
  description: string;
  votes: number;
  imageUrl?: string;
}

export interface VotingCategory {
  id: string;
  name: string;
  nominees: Nominee[];
}

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  locationType: string;
  location: string;
  description: string;
  coverImage: string;
  date: string;
  time: string;
  organizerEmail: string;
  organizerName: string;
  votePrice: number;
  speakers: Speaker[];
  votingEnabled: boolean;
  votingEndDate?: string;
  votingCategories: VotingCategory[];
  ticketTiers: TicketTier[];
  agenda: AgendaItem[];
  rsvpEnabled: boolean;
  status: EventStatus;
  createdAt: number;
}

/** In-progress event used by the multi-step create wizard. */
export interface DraftEvent {
  title: string;
  category: string;
  locationType: string;
  location: string;
  description: string;
  coverImage: string;
  date: string;
  time: string;
  speakers: Speaker[];
  votingEnabled: boolean;
  votingEndDate?: string;
  votingCategories: VotingCategory[];
  ticketTiers: TicketTier[];
  agenda: AgendaItem[];
  rsvpEnabled: boolean;
}

const DRAFT_KEY = 'eventnic_draft_v2';
const VOTES_KEY = 'eventnic_votes_v2';

export const uid = () => Math.random().toString(36).slice(2, 10);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || `event-${uid()}`;

export const emptyDraft = (): DraftEvent => ({
  title: '',
  category: '',
  locationType: 'physical',
  location: '',
  description: '',
  coverImage: '',
  date: '',
  time: '',
  speakers: [],
  votingEnabled: false,
  votingEndDate: '',
  votingCategories: [],
  ticketTiers: [],
  agenda: [],
  rsvpEnabled: false,
});

// ---- Pure aggregate helpers (work on a single event) ----
export const eventSold = (e: EventRecord) => e.ticketTiers.reduce((n, t) => n + (t.sold || 0), 0);
export const eventCapacity = (e: EventRecord) => e.ticketTiers.reduce((n, t) => n + (t.quantity || 0), 0);
export const eventRevenue = (e: EventRecord) =>
  e.ticketTiers.reduce((n, t) => n + (t.sold || 0) * (t.price || 0), 0);
export const eventSoldPct = (e: EventRecord) => {
  const cap = eventCapacity(e);
  return cap > 0 ? Math.round((eventSold(e) / cap) * 100) : 0;
};

export interface PlatformTotals {
  totalEvents: number;
  activeEvents: number;
  pending: number;
  revenue: number;
  ticketsSold: number;
}

export interface OrganizerTotals {
  revenue: number;
  ticketsSold: number;
  activeEvents: number;
  totalEvents: number;
}

export interface NomineeStanding {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  categoryId: string;
  category: string;
  votes: number;
  rank: number;
  totalNominees: number;
  leaderVotes: number;
}

interface EventsContextType {
  events: EventRecord[];
  draft: DraftEvent;
  // queries
  getEvent: (idOrSlug: string) => EventRecord | undefined;
  getEventsByOrganizer: (email: string) => EventRecord[];
  getPublishedEvents: () => EventRecord[];
  getPendingEvents: () => EventRecord[];
  platformTotals: () => PlatformTotals;
  organizerTotals: (email: string) => OrganizerTotals;
  nomineeStandings: (name: string) => NomineeStanding[];
  hasVoted: (eventId: string, categoryId: string) => boolean;
  // mutations
  createEvent: (data: DraftEvent, status: EventStatus, organizerEmail: string, organizerName: string, votePrice: number) => Promise<EventRecord>;
  updateEvent: (id: string, patch: Partial<EventRecord>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  approveEvent: (id: string) => Promise<void>;
  rejectEvent: (id: string) => Promise<void>;
  castVote: (eventId: string, categoryId: string, nomineeId: string) => Promise<boolean>;
  recordPurchase: (eventId: string, tierId: string, qty: number) => Promise<void>;
  // draft
  updateDraft: (patch: Partial<DraftEvent>) => void;
  resetDraft: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

function loadDraft(): DraftEvent {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return { ...emptyDraft(), ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to parse stored draft:', err);
  }
  return emptyDraft();
}

function loadVotes(): string[] {
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return [];
}

const db = getFirestore(app);
const auth = getAuth(app);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [draft, setDraft] = useState<DraftEvent>(loadDraft);
  const [votes, setVotes] = useState<string[]>(loadVotes);

  // Sync events from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const liveEvents: EventRecord[] = [];
      snapshot.forEach((doc) => {
        liveEvents.push(doc.data() as EventRecord);
      });
      // Sort by creation date descending
      setEvents(liveEvents.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error("Error fetching live events:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  }, [votes]);

  const getEvent = useCallback(
    (idOrSlug: string) => events.find((e) => e.id === idOrSlug || e.slug === idOrSlug),
    [events],
  );

  const getEventsByOrganizer = useCallback(
    (email: string) =>
      events
        .filter((e) => e.organizerEmail.toLowerCase() === email.toLowerCase())
        .sort((a, b) => b.createdAt - a.createdAt),
    [events],
  );

  const getPublishedEvents = useCallback(
    () => events.filter((e) => e.status === 'published').sort((a, b) => b.createdAt - a.createdAt),
    [events],
  );

  const getPendingEvents = useCallback(
    () => events.filter((e) => e.status === 'pending').sort((a, b) => b.createdAt - a.createdAt),
    [events],
  );

  const platformTotals = useCallback((): PlatformTotals => {
    const published = events.filter((e) => e.status === 'published');
    return {
      totalEvents: events.length,
      activeEvents: published.length,
      pending: events.filter((e) => e.status === 'pending').length,
      revenue: published.reduce((n, e) => n + eventRevenue(e), 0),
      ticketsSold: published.reduce((n, e) => n + eventSold(e), 0),
    };
  }, [events]);

  const organizerTotals = useCallback(
    (email: string): OrganizerTotals => {
      const mine = events.filter((e) => e.organizerEmail.toLowerCase() === email.toLowerCase());
      return {
        revenue: mine.reduce((n, e) => n + eventRevenue(e), 0),
        ticketsSold: mine.reduce((n, e) => n + eventSold(e), 0),
        activeEvents: mine.filter((e) => e.status === 'published').length,
        totalEvents: mine.length,
      };
    },
    [events],
  );

  const nomineeStandings = useCallback(
    (name: string): NomineeStanding[] => {
      const target = name.trim().toLowerCase();
      const out: NomineeStanding[] = [];
      for (const e of events) {
        if (!e.votingEnabled) continue;
        for (const cat of e.votingCategories) {
          const sorted = [...cat.nominees].sort((a, b) => b.votes - a.votes);
          const idx = sorted.findIndex((n) => n.name.trim().toLowerCase() === target);
          if (idx === -1) continue;
          out.push({
            eventId: e.id,
            eventSlug: e.slug,
            eventTitle: e.title,
            categoryId: cat.id,
            category: cat.name,
            votes: sorted[idx].votes,
            rank: idx + 1,
            totalNominees: sorted.length,
            leaderVotes: sorted[0]?.votes ?? 0,
          });
        }
      }
      return out;
    },
    [events],
  );

  const hasVoted = useCallback(
    (eventId: string, categoryId: string) => votes.includes(`${eventId}:${categoryId}`),
    [votes],
  );

  const createEvent = useCallback(
    async (data: DraftEvent, status: EventStatus, organizerEmail: string, organizerName: string, votePrice: number): Promise<EventRecord> => {
      const newId = uid();
      const record: EventRecord = {
        ...data,
        id: newId,
        slug: slugify(data.title || 'untitled-event') + '-' + newId.slice(0, 4),
        organizerEmail,
        organizerName,
        votePrice,
        status,
        createdAt: Date.now(),
        votingEndDate: data.votingEndDate,
        ticketTiers: data.ticketTiers.map((t) => ({ ...t, sold: 0 })),
        votingCategories: data.votingCategories.map((c) => ({
          ...c,
          nominees: c.nominees.map((n) => ({ ...n, votes: 0 })),
        })),
      };
      await setDoc(doc(db, 'events', newId), record);
      return record;
    },
    [],
  );

  const updateEvent = useCallback(async (id: string, patch: Partial<EventRecord>) => {
    await updateDoc(doc(db, 'events', id), patch);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'events', id));
  }, []);

  const approveEvent = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'events', id), { status: 'published' });
  }, []);

  const rejectEvent = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'events', id), { status: 'rejected' });
  }, []);

  const castVote = useCallback(
    async (eventId: string, categoryId: string, nomineeId: string): Promise<boolean> => {
      let voterId = localStorage.getItem('anonVoterId');
      let firebaseUser = auth.currentUser;

      if (!voterId) {
        voterId = uid();
        localStorage.setItem('anonVoterId', voterId);
      }

      if (!firebaseUser) {
        try {
          const credential = await signInAnonymously(auth);
          firebaseUser = credential.user;
        } catch (error) {
          console.error('Anonymous sign-in failed for voting:', error);
        }
      }

      const key = `${eventId}:${categoryId}`;
      if (votes.includes(key)) return false;
      
      const eventRef = doc(db, 'events', eventId);
      const snap = await getDoc(eventRef);
      if (!snap.exists()) return false;
      
      const eventData = snap.data() as EventRecord;
      if (eventData.votingEnabled && eventData.votingEndDate) {
        const now = new Date();
        const endDate = new Date(eventData.votingEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (now > endDate) return false;
      }

      const updatedCategories = eventData.votingCategories.map((c) =>
        c.id !== categoryId
          ? c
          : {
              ...c,
              nominees: c.nominees.map((n) => (n.id === nomineeId ? { ...n, votes: n.votes + 1 } : n)),
            },
      );
      
      // Update event doc
      await updateDoc(eventRef, { votingCategories: updatedCategories });
      
      // Write to votes collection
      const voteId = uid();
      await setDoc(doc(db, 'votes', voteId), {
        id: voteId,
        eventId,
        categoryId,
        nomineeId,
        voterId,
        createdAt: Date.now()
      });

      setVotes((prev) => [...prev, key]);
      return true;
    },
    [votes],
  );

  const recordPurchase = useCallback(async (eventId: string, tierId: string, qty: number) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const eventRef = doc(db, 'events', eventId);
    const snap = await getDoc(eventRef);
    if (!snap.exists()) return;
    
    const eventData = snap.data() as EventRecord;
    const updatedTiers = eventData.ticketTiers.map((t) =>
      t.id === tierId ? { ...t, sold: Math.min(t.quantity, t.sold + qty) } : t,
    );
    
    // Update event doc
    await updateDoc(eventRef, { ticketTiers: updatedTiers });
    
    // Write to tickets collection
    for (let i = 0; i < qty; i++) {
      const ticketId = uid();
      await setDoc(doc(db, 'tickets', ticketId), {
        id: ticketId,
        eventId,
        tierId,
        userId: user.uid,
        status: 'valid', // valid, checked_in, cancelled
        createdAt: Date.now()
      });
    }
  }, []);

  const updateDraft = useCallback((patch: Partial<DraftEvent>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft()), []);

  const value: EventsContextType = {
    events,
    draft,
    getEvent,
    getEventsByOrganizer,
    getPublishedEvents,
    getPendingEvents,
    platformTotals,
    organizerTotals,
    nomineeStandings,
    hasVoted,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
    castVote,
    recordPurchase,
    updateDraft,
    resetDraft,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (ctx === undefined) throw new Error('useEvents must be used within an EventsProvider');
  return ctx;
}
