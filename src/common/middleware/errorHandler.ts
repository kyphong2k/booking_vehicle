import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '@/common/errors/AppError';
import { formatZodError } from '@/common/errors/httpErrors';
import { sendError, type ApiErrorBody } from '@/common/utils/response';
import { getEnv } from '@/config/env';
import { logger } from '@/infrastructure/logger/pino';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const env = getEnv();
  const requestId = typeof req.requestId === 'string' ? req.requestId : undefined;

  if (err instanceof ZodError) {
    const body: ApiErrorBody = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: formatZodError(err),
    };
    return sendError(res, StatusCodes.BAD_REQUEST, body);
  }

  if (err instanceof AppError) {
    const body: ApiErrorBody = { code: err.code, message: err.message };
    if (err.details !== undefined) {
      body.details = err.details;
    }
    return sendError(res, err.statusCode, body);
  }

  logger.error({ err, requestId }, 'Unhandled error');

  const exposeMessage = env.NODE_ENV !== 'production';
  const message =
    exposeMessage && err instanceof Error ? err.message : 'An unexpected error occurred';

  return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    code: 'INTERNAL_ERROR',
    message,
  });
};
