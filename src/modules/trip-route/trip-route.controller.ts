import { asyncHandler } from '@/common/utils/asyncHandler';
import { sendSuccess } from '@/common/utils/response';
import { StatusCodes } from 'http-status-codes';
import { createRouteBodySchema } from './trip-route.scheme';
import { validationError } from '@/common/errors/httpErrors';
import * as tripRouteService from './trip-route.service';

export const createTripRoute = asyncHandler(async (req, res) => {
  const parsed = createRouteBodySchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error);
  const tripRoute = await tripRouteService.createTripRoute(parsed.data);
  sendSuccess(res, StatusCodes.CREATED, tripRoute);
});
