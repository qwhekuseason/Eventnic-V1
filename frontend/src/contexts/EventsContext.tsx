import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { SEED_EVENTS } from './seedEvents';

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
  speakers: Speaker[];
  votingEnabled: boolean;
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
  votingCategories: VotingCategory[];
  ticketTiers: TicketTier[];
  agenda: AgendaItem[];
  rsvpEnabled: boolean;
}

const EVENTS_KEY = 'eventnic_events';
const DRAFT_KEY = 'eventnic_draft';
const VOTES_KEY = 'eventnic_votes';

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
  createEvent: (data: DraftEvent, status: EventStatus, organizerEmail: string, organizerName: string) => EventRecord;
  updateEvent: (id: string, patch: Partial<EventRecord>) => void;
  deleteEvent: (id: string) => void;
  approveEvent: (id: string) => void;
  rejectEvent: (id: string) => void;
  castVote: (eventId: string, categoryId: string, nomineeId: string) => boolean;
  recordPurchase: (eventId: string, tierId: string, qty: number) => void;
  // draft
  updateDraft: (patch: Partial<DraftEvent>) => void;
  resetDraft: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

function loadEvents(): EventRecord[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (raw) return JSON.parse(raw) as EventRecord[];
  } catch (err) {
    console.error('Failed to parse stored events:', err);
  }
  return SEED_EVENTS;
}

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

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRecord[]>(loadEvents);
  const [draft, setDraft] = useState<DraftEvent>(loadDraft);
  const [votes, setVotes] = useState<string[]>(loadVotes);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

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
    (data: DraftEvent, status: EventStatus, organizerEmail: string, organizerName: string): EventRecord => {
      const record: EventRecord = {
        ...data,
        id: uid(),
        slug: slugify(data.title || 'untitled-event') + '-' + uid().slice(0, 4),
        organizerEmail,
        organizerName,
        status,
        createdAt: Date.now(),
        // New events start at zero sales.
        ticketTiers: data.ticketTiers.map((t) => ({ ...t, sold: 0 })),
        // New events start at zero votes.
        votingCategories: data.votingCategories.map((c) => ({
          ...c,
          nominees: c.nominees.map((n) => ({ ...n, votes: 0 })),
        })),
      };
      setEvents((prev) => [record, ...prev]);
      return record;
    },
    [],
  );

  const updateEvent = useCallback((id: string, patch: Partial<EventRecord>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const approveEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'published' } : e)));
  }, []);

  const rejectEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)));
  }, []);

  const castVote = useCallback(
    (eventId: string, categoryId: string, nomineeId: string): boolean => {
      const key = `${eventId}:${categoryId}`;
      if (votes.includes(key)) return false;
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          return {
            ...e,
            votingCategories: e.votingCategories.map((c) =>
              c.id !== categoryId
                ? c
                : {
                    ...c,
                    nominees: c.nominees.map((n) => (n.id === nomineeId ? { ...n, votes: n.votes + 1 } : n)),
                  },
            ),
          };
        }),
      );
      setVotes((prev) => [...prev, key]);
      return true;
    },
    [votes],
  );

  const recordPurchase = useCallback((eventId: string, tierId: string, qty: number) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          ticketTiers: e.ticketTiers.map((t) =>
            t.id === tierId ? { ...t, sold: Math.min(t.quantity, t.sold + qty) } : t,
          ),
        };
      }),
    );
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
