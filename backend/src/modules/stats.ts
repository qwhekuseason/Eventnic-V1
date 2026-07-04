import { Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getFirestore();

    // Count events
    const eventsSnap = await db.collection('events').get();
    const eventsCount = eventsSnap.size;

    // Count tickets (sold)
    const ticketsSnap = await db.collection('tickets').get();
    const ticketsSold = ticketsSnap.size;

    // Count votes (sum quantities if present)
    const votesSnap = await db.collection('votes').get();
    let votesCast = 0;
    votesSnap.forEach((d) => {
      const data: any = d.data();
      if (data && typeof data.quantity === 'number') votesCast += data.quantity;
      else votesCast += 1; // fallback: count documents
    });

    // Global reach: number of unique non-empty locations from events
    const locations = new Set<string>();
    eventsSnap.forEach((d) => {
      const data: any = d.data();
      if (data && data.location) locations.add(String(data.location));
    });

    res.json({
      eventsHosted: eventsCount,
      ticketsSold,
      votesCast,
      globalReach: locations.size,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
