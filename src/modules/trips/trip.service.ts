import { logger } from '@/infrastructure/logger/pino';
import { buildPaginationMeta, type Paginated } from '@/common/pagination';
import * as tripsRepository from './trip.repository';
import { toTripDto, type TripDto } from './trip.dto';
import { TripNotFoundError } from './trip.errors';
import type { CreateTripInput, ListTripsQuery } from './trip.schema';

const log = logger.child({ module: 'trips' });

export async function listTrips(query: ListTripsQuery): Promise<Paginated<TripDto>> {
  const { items, total } = await tripsRepository.listTrips(query);

  log.debug({ total, page: query.page, pageSize: query.pageSize }, 'Listed trips');

  return {
    items: items.map(toTripDto),
    pagination: buildPaginationMeta(query, total),
  };
}

export async function getTripById(id: string): Promise<TripDto> {
  const trip = await tripsRepository.findTripById(id);
  if (!trip) throw new TripNotFoundError(id);

  return toTripDto(trip);
}

export async function createTrip(input: CreateTripInput): Promise<TripDto> {
  const created = await tripsRepository.createTrip(input);

  log.info({ tripId: created.id, route: `${created.origin}->${created.destination}` }, 'Trip created');

  return toTripDto(created);
}
