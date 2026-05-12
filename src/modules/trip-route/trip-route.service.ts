import { log } from 'console';
import { createRoute } from './trip-route.repository';
import { CreateRouteBody } from './trip-route.scheme';
import { logger } from '@/infrastructure/logger/pino';

export async function createTripRoute(data: CreateRouteBody) {
  const created = await createRoute(data);
  return created;
}
