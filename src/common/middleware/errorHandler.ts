import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '@/common/errors/AppError';
import { getEnv } from '@/config/env';
import { logger } from '@/infrastructure/logger/pino';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const fallbackStatus = StatusCodes.INTERNAL_SERVER_ERROR;
  const env = getEnv();
  const requestId = typeof req.requestId === 'string' ? req.requestId : undefined;
  const requestMeta = requestId ? { requestId } : {};

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        details: err.flatten(),
        ...requestMeta,
      },
    });
  }

  if (err instanceof AppError) {
    const errorBody: Record<string, unknown> = {
      code: err.code,
      message: err.message,
      ...requestMeta,
    };
    if (err.details !== undefined) {
      errorBody.details = err.details;
    }
    return res.status(err.statusCode).json({ success: false, error: errorBody });
  }

  logger.error({ err, requestId }, 'Unhandled error');

  const exposeMessage = env.NODE_ENV !== 'production';
  const message =
    exposeMessage && err instanceof Error ? err.message : 'An unexpected error occurred';

  return res.status(fallbackStatus).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message, ...requestMeta },
  });
};

