import { StatusCodes } from 'http-status-codes';
import type { ZodError, ZodIssue } from 'zod';
import { AppError } from './AppError';

export type ValidationIssue = {
  field: string;
  message: string;
  code: ZodIssue['code'];
};

export type ValidationErrorDetails = {
  issues: ValidationIssue[];
};

export function formatZodError(error: ZodError): ValidationErrorDetails {
  return {
    issues: error.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join('.') : 'body',
      message: issue.message,
      code: issue.code,
    })),
  };
}

export function validationError(error: ZodError, message = 'Validation failed'): AppError {
  return new AppError(message, {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    details: formatZodError(error),
  });
}

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

