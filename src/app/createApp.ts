import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { requestLogger } from '@/common/middleware/requestLogger';
import { errorHandler } from '@/common/middleware/errorHandler';
import { registerRoutes } from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestLogger);

  registerRoutes(app);

  app.use(errorHandler);
  return app;
}
