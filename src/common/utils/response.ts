import type { Response } from 'express';

export type ApiMeta = Record<string, unknown>;

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: ApiMeta;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: ApiMeta,
): Response<ApiSuccess<T>> {
  const payload: ApiSuccess<T> = meta ? { success: true, data, meta } : { success: true, data };
  return res.status(statusCode).json(payload);
}

