import { Request, Response } from 'express';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
  // Validate event
  const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxx';
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  const event = req.body;
  const db = getFirestore();

  if (event.event === 'charge.success') {
    const data = event.data;
    const reference = data.reference; // Could be used to idempotently check if already processed
    // In our simplified setup, the frontend triggers the recordPurchase/castVote on callback.
    // In a robust system, we would ONLY do it here.
    
    // Example: Verify transaction and mark it as confirmed
    console.log('Webhook charge.success received for ref:', reference);
    
    // We would parse metadata to see if it's a vote or ticket purchase
    // and record it in Firestore.
  }

  res.send(200);
};
