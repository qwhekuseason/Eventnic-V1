import type { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    ok: false,
    error: 'NotFound',
    message: `No route for ${req.method} ${req.path}`
  });
}

