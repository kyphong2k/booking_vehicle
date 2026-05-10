import { prisma } from '@/infrastructure/prisma';
import { getPaginationSkipTake } from '@/common/pagination';
import type { CreateTripInput, ListTripsQuery } from './trip.schema';

export async function listTrips(query: ListTripsQuery) {
  const { origin, destination } = query;

  const where = {
    ...(origin ? { origin } : {}),
    ...(destination ? { destination } : {}),
  };

  const { skip, take } = getPaginationSkipTake(query);

  const [items, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      skip,
      take,
      orderBy: { departureTime: 'asc' },
    }),
    prisma.trip.count({ where }),
  ]);

  return { items, total };
}

export async function findTripById(id: string) {
  return prisma.trip.findUnique({ where: { id } });
}

export async function createTrip(data: CreateTripInput) {
  return prisma.trip.create({ data });
}
