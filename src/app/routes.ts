import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { getEnv } from '@/config/env';
import { healthRouter } from '@/modules/health/route';

export function registerRoutes(app: Express) {
  const env = getEnv();

  app.use('/health', healthRouter);

  if (env.SWAGGER_ENABLED) {
    const spec = swaggerJSDoc({
      definition: {
        openapi: '3.1.0',
        info: { title: 'booking-vehicle-api', version: '0.1.0' },
      },
      apis: ['src/modules/**/route.ts'],
    });
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  }
}

