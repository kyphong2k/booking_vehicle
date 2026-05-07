import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '@/common/errors/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const fallbackStatus = StatusCodes.INTERNAL_SERVER_ERROR;

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        details: err.flatten(),
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  const message = err instanceof Error ? err.message : 'Unexpected error';
  return res.status(fallbackStatus).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message },
  });
};

