import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { getEnv } from '@/config/env';
import { swaggerDefinition } from '@/openapi/swaggerDefinition';
import { healthRouter } from '@/modules/health/route';
import { tripsRouter } from '@/modules/trip/route';
import { routesRouter } from '@/modules/trip-route/route';

export function registerRoutes(app: Express) {
  const env = getEnv();

  app.use('/health', healthRouter);
  app.use('/trips', tripsRouter);
  app.use('/routes', routesRouter);

  if (env.SWAGGER_ENABLED) {
    const spec = swaggerJSDoc({
      definition: { ...swaggerDefinition },
      apis: ['src/modules/**/route.ts'],
    });
    app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(spec, {
        swaggerOptions: {
          docExpansion: 'none',
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
        },
      }),
    );
  }
}
