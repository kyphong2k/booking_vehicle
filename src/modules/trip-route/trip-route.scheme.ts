import { z } from 'zod';

export const createRouteBodySchema = z.object({
  fromProvince: z
    .string()
    .trim()
    .min(1, 'From province is required')
    .max(200, 'From province must be less than 200 characters'),
  toProvince: z
    .string()
    .trim()
    .min(1, 'To province is required')
    .max(200, 'To province must be less than 200 characters'),
  distanceKm: z
    .number({ message: 'Distance is required' })
    .int()
    .min(5, 'Distance must be greater than 5 km'),
  estimatedDurationMinutes: z
    .number({ message: 'Estimated duration is required' })
    .int()
    .min(10, 'Estimated duration must be greater than 10 minutes'),
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().default(new Date()),
});

export type CreateRouteBody = z.infer<typeof createRouteBodySchema>;
