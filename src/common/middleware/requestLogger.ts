import pinoHttp from 'pino-http';
import { logger } from '@/infrastructure/logger/pino';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: function (_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

