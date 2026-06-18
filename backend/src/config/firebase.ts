import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// The Firebase Admin SDK requires a service account key to operate.
// For security, do not hardcode the key in this file. Provide it via an environment variable
// or as a path to a downloaded JSON file from the Firebase console.

let app;

try {
  // Option 1: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
  // Option 2: Provide the service account key explicitly (e.g. loading from a JSON file)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
    try {
      const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH));
      app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with service account key.');
    } catch (e) {
      console.warn('Could not load service account key, falling back to application default credentials.');
      app = initializeApp({
        credential: applicationDefault()
      });
    }
  } else {
    // If running in an environment with default credentials (like Google Cloud)
    // or if FIREBASE_CONFIG is set in the environment.
    app = initializeApp({
      credential: applicationDefault()
    });
    console.warn('Firebase Admin initialized with application default credentials.');
  }
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export { app };
