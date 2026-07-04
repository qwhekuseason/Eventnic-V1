import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import * as path from 'path';

dotenv.config();

const parseServiceAccountJson = (): unknown | null => {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON) return null;
  try {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON);
  } catch (error) {
    console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON:', error);
    return null;
  }
};

const parseServiceAccountBase64 = (): unknown | null => {
  const base64Value = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!base64Value) return null;
  try {
    const decoded = Buffer.from(base64Value, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY_BASE64:', error);
    return null;
  }
};

const parseServiceAccountString = (): unknown | null => {
  const rawValue = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    return null;
  }
};

const loadServiceAccountFromPath = (): unknown | null => {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
  if (!keyPath) return null;

  try {
    const resolvedPath = path.resolve(keyPath);
    if (!existsSync(resolvedPath)) {
      console.warn(`FIREBASE_SERVICE_ACCOUNT_KEY_PATH does not exist: ${resolvedPath}`);
      return null;
    }
    return require(resolvedPath);
  } catch (error) {
    console.warn('Could not load service account key from FIREBASE_SERVICE_ACCOUNT_KEY_PATH:', error);
    return null;
  }
};

const getFirebaseCredential = () => {
  let source = 'none';

  const serviceAccountJson = parseServiceAccountJson();
  if (serviceAccountJson) {
    source = 'FIREBASE_SERVICE_ACCOUNT_KEY_JSON';
    return { credential: cert(serviceAccountJson), source };
  }

  const serviceAccountBase64 = parseServiceAccountBase64();
  if (serviceAccountBase64) {
    source = 'FIREBASE_SERVICE_ACCOUNT_KEY_BASE64';
    return { credential: cert(serviceAccountBase64), source };
  }

  const serviceAccountString = parseServiceAccountString();
  if (serviceAccountString) {
    source = 'FIREBASE_SERVICE_ACCOUNT_KEY';
    return { credential: cert(serviceAccountString), source };
  }

  const serviceAccountPath = loadServiceAccountFromPath();
  if (serviceAccountPath) {
    source = 'FIREBASE_SERVICE_ACCOUNT_KEY_PATH';
    return { credential: cert(serviceAccountPath), source };
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (existsSync(credPath)) {
      source = 'GOOGLE_APPLICATION_CREDENTIALS';
      console.log('Using GOOGLE_APPLICATION_CREDENTIALS path for Firebase Admin initialization.');
      return { credential: applicationDefault(), source };
    }
    console.warn(`GOOGLE_APPLICATION_CREDENTIALS path does not exist: ${credPath}`);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing Firebase service account credentials in production. Set FIREBASE_SERVICE_ACCOUNT_KEY_JSON, FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, FIREBASE_SERVICE_ACCOUNT_KEY, or FIREBASE_SERVICE_ACCOUNT_KEY_PATH.'
    );
  }

  source = 'applicationDefault';
  console.warn('No explicit Firebase service account credentials found. Falling back to application default credentials.');
  return { credential: applicationDefault(), source };
};

if (!getApps().length) {
  try {
    const { credential, source } = getFirebaseCredential();
    initializeApp({
      credential,
    });
    console.log(`Firebase Admin initialized successfully using ${source}.`);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

export {};
