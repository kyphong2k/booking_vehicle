import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/** Propagates or generates `X-Request-Id` for log correlation and support. */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.get('x-request-id');
  req.requestId = typeof header === 'string' && header.trim().length > 0 ? header.trim() : randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
}
