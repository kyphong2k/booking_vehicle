import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

export function badRequest(message = 'Bad request', details?: unknown): AppError {
  return new AppError(message, { statusCode: StatusCodes.BAD_REQUEST, code: 'BAD_REQUEST', details });
}

export function unauthorized(message = 'Unauthorized', details?: unknown): AppError {
  return new AppError(message, {
    statusCode: StatusCodes.UNAUTHORIZED,
    code: 'UNAUTHORIZED',
    details,
  });
}

export function forbidden(message = 'Forbidden', details?: unknown): AppError {
  return new AppError(message, { statusCode: StatusCodes.FORBIDDEN, code: 'FORBIDDEN', details });
}

export function notFound(message = 'Not found', details?: unknown): AppError {
  return new AppError(message, { statusCode: StatusCodes.NOT_FOUND, code: 'NOT_FOUND', details });
}

