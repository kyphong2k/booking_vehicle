import { errorHandler } from '@/common/middleware/errorHandler';
import { requestIdMiddleware } from '@/common/middleware/requestId';
import { requestLogger } from '@/common/middleware/requestLogger';
import { getEnv } from '@/config/env';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { registerRoutes } from './routes';

export function createApp() {
  const app = express();
  const env = getEnv();
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  registerRoutes(app);

  app.use(errorHandler);
  return app;
}
