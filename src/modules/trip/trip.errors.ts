import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/common/errors/AppError';

export class TripNotFoundError extends AppError {
  constructor(tripId: string) {
    super('Trip not found', {
      statusCode: StatusCodes.NOT_FOUND,
      code: 'TRIP_NOT_FOUND',
      details: { tripId },
    });
    this.name = 'TripNotFoundError';
  }
}
