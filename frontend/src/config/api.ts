const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const randomString = (length = 8): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((byte) => CHARSET[byte % CHARSET.length])
      .join('');
  }
  return Math.random().toString(36).slice(-length).padStart(length, '0');
};

export const apiBaseUrl = DEFAULT_API_BASE_URL;

export const secureId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return randomString(16);
};

export const securePassword = (length = 10): string => randomString(length);

export const generateReference = (prefix: string): string => `${prefix}-${Date.now()}-${randomString(8)}`;
