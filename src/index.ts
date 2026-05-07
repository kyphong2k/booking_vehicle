import '@/config';
import { createApp } from '@/app/createApp';
import { getEnv } from '@/config/env';
import { logger } from '@/infrastructure/logger/pino';

const env = getEnv();
const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'HTTP server started');
});

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

