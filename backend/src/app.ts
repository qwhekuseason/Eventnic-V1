import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import './config/firebase';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { handleUSSD } from './modules/ussd';
import { createEvent, purchaseTicket, castVote } from './modules/events';
import { getStats } from './modules/stats';
import { sendBroadcast } from './modules/email';
import { paystackWebhook } from './modules/webhooks';
import { validate } from './middleware/validate';
import { createEventSchema, purchaseTicketSchema, castVoteSchema, broadcastSchema } from './validators/events';
import { config } from './config/index';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.get('/', (req, res) => {
  res.send('Eventnic Backend API is running successfully!');
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (Array.isArray(config.corsOrigin) && config.corsOrigin.includes(origin)) {
        callback(null, true);
        return;
      }
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: false,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());

// Rate limiting
app.set('trust proxy', 1);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Eventnic API is running' });
});

// Live stats
app.get('/api/stats', getStats);

// USSD Gateway Route
app.post('/api/ussd', handleUSSD);

// Events API (Secure Backend integration)
app.post('/api/events/create', validate(createEventSchema), createEvent);
app.post('/api/events/purchase', validate(purchaseTicketSchema), purchaseTicket);
app.post('/api/events/vote', validate(castVoteSchema), castVote);
app.post('/api/broadcasts/send', validate(broadcastSchema), sendBroadcast);
app.post('/api/webhooks/paystack', paystackWebhook);

// Example route using Firebase Admin
app.get('/api/verify-auth', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Endpoint to create nominee accounts via Admin SDK
app.post('/api/nominees/create-account', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // In a real system, we might verify if the user is an organizer, 
    // but for now verifying they are authenticated is sufficient.

    const { email, password, name, phone, imageUrl, eventId } = req.body;
    
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Create the user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create the corresponding record in Firestore
    await getFirestore().collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email,
      role: 'NOMINEE',
      name,
      phone: phone || '',
      imageUrl: imageUrl || '',
      eventId: eventId || '',
      verificationStatus: 'VERIFIED',
      createdAt: Date.now()
    });

    res.status(201).json({ success: true, uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating nominee account:', error);
    res.status(500).json({ error: 'Failed to create account', details: error });
  }
});

// Endpoint to reset nominee password
app.post('/api/nominees/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    await getAuth().verifyIdToken(token);
    
    const { nomineeUid, newPassword } = req.body;
    
    if (!nomineeUid || !newPassword) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Update the user's password in Firebase Auth
    await getAuth().updateUser(nomineeUid, {
      password: newPassword
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password', details: error });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
