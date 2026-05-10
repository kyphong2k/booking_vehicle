import type { Trip } from '@/infrastructure/prisma/generated';

export type TripDto = {
  id: string;
  operatorName: string;
  origin: string;
  destination: string;
  departureTime: string;
  priceVnd: number;
  totalSeats: number;
  busType: 'SEATER' | 'SLEEPER' | 'LIMOUSINE';
};

export function toTripDto(trip: Trip): TripDto {
  const { id, operatorName, origin, destination, departureTime, priceVnd, totalSeats, busType } =
    trip;
  return {
    id,
    operatorName,
    origin,
    destination,
    departureTime: departureTime.toISOString(),
    priceVnd,
    totalSeats,
    busType,
  };
}
