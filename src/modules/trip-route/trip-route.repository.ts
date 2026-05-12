import { prisma } from '@/infrastructure/prisma';
import { CreateRouteBody } from './trip-route.scheme';

export async function createRoute(data: CreateRouteBody) {
  return prisma.route.create({
    data: {
      ...data,
      description: data.description ?? null,
    },
  });
}
