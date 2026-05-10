import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Trip } from '@/infrastructure/prisma/generated';
import * as tripsRepository from './trip.repository';
import * as tripsService from './trip.service';
import { TripNotFoundError } from './trip.errors';

vi.mock('./trip.repository', () => ({
  listTrips: vi.fn(),
  findTripById: vi.fn(),
  createTrip: vi.fn(),
}));

const mockedRepo = vi.mocked(tripsRepository);

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    operatorName: 'Phuong Trang',
    origin: 'HCM',
    destination: 'Da Lat',
    departureTime: new Date('2026-06-01T08:00:00.000Z'),
    priceVnd: 350_000,
    totalSeats: 40,
    busType: 'SLEEPER',
    ...overrides,
  };
}

describe('tripsService.listTrips', () => {
  beforeEach(() => {
    mockedRepo.listTrips.mockReset();
  });

  it('maps items to DTOs and returns pagination meta', async () => {
    const trip = makeTrip();
    mockedRepo.listTrips.mockResolvedValue({ items: [trip], total: 1 });

    const result = await tripsService.listTrips({ page: 1, pageSize: 20 });

    expect(mockedRepo.listTrips).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(trip.id);
    expect(result.items[0]?.departureTime).toBe(trip.departureTime.toISOString());
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it('returns empty list with totalPages = 0 when no records', async () => {
    mockedRepo.listTrips.mockResolvedValue({ items: [], total: 0 });

    const result = await tripsService.listTrips({ page: 1, pageSize: 20 });

    expect(result.items).toEqual([]);
    expect(result.pagination.totalPages).toBe(0);
  });
});

describe('tripsService.getTripById', () => {
  beforeEach(() => {
    mockedRepo.findTripById.mockReset();
  });

  it('returns DTO when trip exists', async () => {
    const trip = makeTrip();
    mockedRepo.findTripById.mockResolvedValue(trip);

    const dto = await tripsService.getTripById(trip.id);

    expect(mockedRepo.findTripById).toHaveBeenCalledWith(trip.id);
    expect(dto.id).toBe(trip.id);
  });

  it('throws TripNotFoundError when trip is missing', async () => {
    mockedRepo.findTripById.mockResolvedValue(null);

    await expect(tripsService.getTripById('00000000-0000-0000-0000-000000000000')).rejects.toBeInstanceOf(
      TripNotFoundError,
    );
  });
});

describe('tripsService.createTrip', () => {
  beforeEach(() => {
    mockedRepo.createTrip.mockReset();
  });

  it('forwards input to repository and returns DTO', async () => {
    const created = makeTrip({ id: '22222222-2222-2222-2222-222222222222' });
    mockedRepo.createTrip.mockResolvedValue(created);

    const dto = await tripsService.createTrip({
      operatorName: created.operatorName,
      origin: created.origin,
      destination: created.destination,
      departureTime: created.departureTime,
      priceVnd: created.priceVnd,
      totalSeats: created.totalSeats,
      busType: created.busType,
    });

    expect(mockedRepo.createTrip).toHaveBeenCalledTimes(1);
    expect(dto.id).toBe(created.id);
  });
});
