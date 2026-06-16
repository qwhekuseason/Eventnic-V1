import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};

