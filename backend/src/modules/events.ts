import { Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { randomBytes } from 'crypto';

const uid = () => randomBytes(16).toString('hex');
const slugify = (text: string) => text.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    await getAuth().verifyIdToken(token);

    const { data, status, organizerEmail, organizerName, votePrice } = req.body;
    if (!data || !organizerEmail || !organizerName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newId = uid();
    const db = getFirestore();
    
    const record = {
      ...data,
      id: newId,
      slug: slugify(data.title || 'untitled-event') + '-' + newId.slice(0, 4),
      organizerEmail,
      organizerName,
      votePrice,
      status,
      createdAt: Date.now(),
      votingEndDate: data.votingEndDate,
      ticketTiers: data.ticketTiers.map((t: any) => ({ ...t, sold: 0 })),
      votingCategories: data.votingCategories.map((c: any) => ({
        ...c,
        nominees: c.nominees.map((n: any) => ({ ...n, votes: 0 })),
      })),
    };

    await db.collection('events').doc(newId).set(record);
    res.status(201).json({ success: true, record });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const purchaseTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { eventId, tierId, qty, attendeeNames } = req.body;
    if (!eventId || !tierId || !qty) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getFirestore();
    const eventRef = db.collection('events').doc(eventId);
    
    await db.runTransaction(async (t) => {
      const snap = await t.get(eventRef);
      if (!snap.exists) throw new Error('Event not found');
      
      const eventData = snap.data() as any;
      const tierIndex = eventData.ticketTiers.findIndex((t: any) => t.id === tierId);
      
      if (tierIndex === -1) throw new Error('Ticket tier not found');
      
      const tier = eventData.ticketTiers[tierIndex];
      const newSold = Math.min(tier.quantity, tier.sold + qty);
      
      eventData.ticketTiers[tierIndex].sold = newSold;
      
      t.update(eventRef, { ticketTiers: eventData.ticketTiers });
      
      for (let i = 0; i < qty; i++) {
        const ticketId = uid();
        const ticketRef = db.collection('tickets').doc(ticketId);
        
        // Use provided name for this specific ticket, or fallback to an empty string
        const attendeeName = (attendeeNames && Array.isArray(attendeeNames) && attendeeNames[i]) 
                              ? attendeeNames[i] 
                              : '';

        t.set(ticketRef, {
          id: ticketId,
          eventId,
          tierId,
          userId,
          attendeeName, // New field to hold the name of the person using the ticket
          status: 'valid',
          createdAt: Date.now()
        });
      }
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase ticket' });
  }
};

export const castVote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, categoryId, nomineeId, qty, voterId } = req.body;
    if (!eventId || !categoryId || !nomineeId || !qty || !voterId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getFirestore();
    const eventRef = db.collection('events').doc(eventId);
    
    await db.runTransaction(async (t) => {
      const snap = await t.get(eventRef);
      if (!snap.exists) throw new Error('Event not found');
      
      const eventData = snap.data() as any;
      
      if (eventData.votingEnabled && eventData.votingEndDate) {
        const now = new Date();
        const endDate = new Date(eventData.votingEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (now > endDate) throw new Error('Voting has ended');
      }

      const catIndex = eventData.votingCategories.findIndex((c: any) => c.id === categoryId);
      if (catIndex === -1) throw new Error('Category not found');
      
      const nomIndex = eventData.votingCategories[catIndex].nominees.findIndex((n: any) => n.id === nomineeId);
      if (nomIndex === -1) throw new Error('Nominee not found');
      
      eventData.votingCategories[catIndex].nominees[nomIndex].votes += qty;
      
      t.update(eventRef, { votingCategories: eventData.votingCategories });
      
      const voteId = uid();
      const voteRef = db.collection('votes').doc(voteId);
      t.set(voteRef, {
        id: voteId,
        eventId,
        categoryId,
        nomineeId,
        voterId,
        quantity: qty,
        createdAt: Date.now()
      });
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error casting vote:', error);
    res.status(500).json({ error: error.message || 'Failed to cast vote' });
  }
};
