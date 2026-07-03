import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBroadcast = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // In a real app we'd check if they are an organizer here
    
    const { subject, message, targetAudience, eventId } = req.body;
    
    if (!subject || !message || !targetAudience || !eventId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getFirestore();
    const eventRef = db.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();
    
    if (!eventSnap.exists) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    // Check ownership
    const eventData = eventSnap.data();
    if (eventData?.organizerEmail?.toLowerCase() !== decodedToken.email?.toLowerCase()) {
      res.status(403).json({ error: 'Not authorized for this event' });
      return;
    }

    // Fetch tickets based on target audience
    let query = db.collection('tickets').where('eventId', '==', eventId);
    
    if (targetAudience === 'checked_in') {
      query = query.where('status', '==', 'checked_in');
    }
    // "all_attendees" doesn't need extra where clauses beyond eventId
    // "vip_only" would require knowing which tiers are VIP, etc.

    const ticketsSnap = await query.get();
    
    if (ticketsSnap.empty) {
      res.status(400).json({ error: 'No attendees found for this target' });
      return;
    }

    const emails = new Set<string>();
    
    // Resolving users to get their emails
    for (const docSnap of ticketsSnap.docs) {
      const ticket = docSnap.data();
      if (ticket.userId) {
        try {
          const userRec = await getAuth().getUser(ticket.userId);
          if (userRec.email) emails.add(userRec.email);
        } catch (e) {
          // ignore
        }
      }
    }

    const emailList = Array.from(emails);
    
    if (emailList.length === 0) {
      res.status(400).json({ error: 'No valid emails found to broadcast to.' });
      return;
    }

    if (process.env.SMTP_USER) {
      // Send the emails using BCC
      await transporter.sendMail({
        from: `"Eventnic Notifications" <${process.env.SMTP_USER}>`,
        bcc: emailList,
        subject: subject,
        text: message,
        html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
      });
    } else {
      console.log('SMTP not configured, simulating broadcast to:', emailList.length, 'recipients');
    }

    res.status(200).json({ success: true, count: emailList.length });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
};
