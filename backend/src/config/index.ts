import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const parseCorsOrigin = (value: string | undefined) => {
  if (!value) {
    return ['http://localhost:5173', 'https://eventnic-v1-nw.vercel.app'];
  }
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

export const config = {
  port: toNumber(process.env.PORT, 5000),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
};

