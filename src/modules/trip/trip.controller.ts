import { StatusCodes } from 'http-status-codes';
import { validationError } from '@/common/errors/httpErrors';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { sendSuccess } from '@/common/utils/response';
import { createTripBodySchema, listTripsQuerySchema, tripIdSchema } from './trip.schema';
import * as tripsService from './trip.service';

export const listTrips = asyncHandler(async (req, res) => {
  const parsed = listTripsQuerySchema.safeParse(req.query);
  if (!parsed.success) throw validationError(parsed.error, 'Invalid query');

  const { items, pagination } = await tripsService.listTrips(parsed.data);
  return sendSuccess(res, StatusCodes.OK, items, { pagination });
});

export const getTripById = asyncHandler(async (req, res) => {
  const idParsed = tripIdSchema.safeParse(req.params.id);
  if (!idParsed.success) throw validationError(idParsed.error, 'Invalid id');

  const trip = await tripsService.getTripById(idParsed.data);
  return sendSuccess(res, StatusCodes.OK, trip);
});

export const createTrip = asyncHandler(async (req, res) => {
  const parsed = createTripBodySchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error);

  const created = await tripsService.createTrip(parsed.data);
  return sendSuccess(res, StatusCodes.CREATED, created);
});
