import { StatusCodes } from 'http-status-codes';
import { badRequest } from '@/common/errors/httpErrors';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { sendSuccess } from '@/common/utils/response';
import { createTripBodySchema, listTripsQuerySchema, tripIdSchema } from './trip.schema';
import * as tripsService from './trip.service';

export const listTrips = asyncHandler(async (req, res) => {
  const parsed = listTripsQuerySchema.safeParse(req.query);
  if (!parsed.success) throw badRequest('Invalid query', parsed.error.flatten());

  const { items, pagination } = await tripsService.listTrips(parsed.data);
  return sendSuccess(res, StatusCodes.OK, items, { pagination });
});

export const getTripById = asyncHandler(async (req, res) => {
  const idParsed = tripIdSchema.safeParse(req.params.id);
  if (!idParsed.success) throw badRequest('Invalid id', idParsed.error.flatten());

  const trip = await tripsService.getTripById(idParsed.data);
  return sendSuccess(res, StatusCodes.OK, trip);
});

export const createTrip = asyncHandler(async (req, res) => {
  const parsed = createTripBodySchema.safeParse(req.body);
  if (!parsed.success) throw badRequest('Validation error', parsed.error.flatten());

  const created = await tripsService.createTrip(parsed.data);
  return sendSuccess(res, StatusCodes.CREATED, created);
});
