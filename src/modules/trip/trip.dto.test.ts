import { describe, expect, it } from 'vitest';
import type { Trip } from '@/infrastructure/prisma/generated';
import { toTripDto } from './trip.dto';

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    operatorName: 'Phuong Trang',
    origin: 'HCM',
    destination: 'Da Lat',
    departureTime: new Date('2026-06-01T08:00:00.000Z'),
    arrivalTime: new Date('2026-06-01T12:00:00.000Z'),
    priceVnd: 350_000,
    totalSeats: 40,
    busType: 'SLEEPER',
    routeId: '11111111-1111-1111-1111-111111111111',
    ...overrides,
  };
}

describe('toTripDto', () => {
  it('serializes departureTime to ISO string', () => {
    const dto = toTripDto(makeTrip());
    expect(dto.departureTime).toBe('2026-06-01T08:00:00.000Z');
  });

  it('passes through scalar fields', () => {
    const dto = toTripDto(makeTrip({ priceVnd: 500_000, totalSeats: 30, busType: 'LIMOUSINE' }));
    expect(dto).toMatchObject({
      operatorName: 'Phuong Trang',
      origin: 'HCM',
      destination: 'Da Lat',
      priceVnd: 500_000,
      totalSeats: 30,
      busType: 'LIMOUSINE',
    });
  });
});
