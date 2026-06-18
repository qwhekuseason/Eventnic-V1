import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  cert: jest.fn(),
  applicationDefault: jest.fn()
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn()
}));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn()
}));

import app from '../src/app';

describe('Health check API', () => {
  it('should return 200 and running status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', message: 'Eventnic API is running' });
  });
});
