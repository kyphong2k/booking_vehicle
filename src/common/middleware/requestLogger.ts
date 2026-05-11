import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import pinoHttp from 'pino-http';
import { logger } from '@/infrastructure/logger/pino';

type ReqWithId = IncomingMessage & { requestId?: string };

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage) => {
    const r = req as ReqWithId;
    return typeof r.requestId === 'string' && r.requestId.length > 0 ? r.requestId : randomUUID();
  },
  customLogLevel: function (_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

