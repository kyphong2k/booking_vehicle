import { z } from 'zod';
import { paginationQuerySchema } from '@/common/pagination';

export const tripIdSchema = z.string().uuid();

export const busTypeSchema = z.enum(['SEATER', 'SLEEPER', 'LIMOUSINE']);

export const listTripsQuerySchema = paginationQuerySchema.extend({
  origin: z.string().trim().min(1).optional(),
  destination: z.string().trim().min(1).optional(),
});

export const createTripBodySchema = z.object({
  operatorName: z.string().trim().min(1).max(200),
  origin: z.string().trim().min(1).max(200),
  destination: z.string().trim().min(1).max(200),
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date(),
  priceVnd: z.coerce.number().int().min(0),
  totalSeats: z.coerce.number().int().min(1).max(100),
  busType: busTypeSchema,
  routeId: z.string().uuid(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().default(new Date()),
});

export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
export type CreateTripInput = z.infer<typeof createTripBodySchema>;
