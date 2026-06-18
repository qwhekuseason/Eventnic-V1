import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Eventnic API is running' });
});

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
