import type { Express } from 'express';
import { healthRouter } from './health/health.routes.js';

export function registerModules(app: Express) {
  app.use(healthRouter);
}

