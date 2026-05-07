import { StatusCodes } from 'http-status-codes';

export type AppErrorOptions = {
  statusCode?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = options.code ?? 'INTERNAL_ERROR';
    this.details = options.details;
  }
}

