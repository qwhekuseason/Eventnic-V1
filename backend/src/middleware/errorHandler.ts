import type { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err);

  res.status(500).json({
    ok: false,
    error: 'InternalServerError',
    message: err instanceof Error ? err.message : 'Unknown error'
  });
}

