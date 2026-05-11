import { paginationOpenApiSchemas } from './schemas/pagination';
import { routesOpenApiSchemas } from './schemas/trip-route';
import { tripsOpenApiSchemas } from './schemas/trips';

/** Base OpenAPI definition merged by swagger-jsdoc with path annotations in route files. */
export const swaggerDefinition = {
  openapi: '3.1.0',
  info: { title: 'booking-vehicle-api', version: '0.1.0' },
  tags: [
    { name: 'Health', description: 'Service health' },
    { name: 'Trips', description: 'Trip resources' },
    { name: 'Routes', description: 'Route definitions' },
  ],
  components: {
    schemas: {
      ...paginationOpenApiSchemas,
      ...tripsOpenApiSchemas,
      ...routesOpenApiSchemas,
    },
  },
} as const;
