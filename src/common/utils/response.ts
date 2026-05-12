import type { Request, Response } from 'express';

export type ApiMeta = {
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: ApiMeta;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiError = {
  success: false;
  error: ApiErrorBody;
  meta: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function buildMeta(
  req: Pick<Request, 'requestId'> | undefined | null,
  extra?: Record<string, unknown>,
): ApiMeta {
  const requestId = req?.requestId;
  return {
    timestamp: new Date().toISOString(),
    ...(requestId ? { requestId } : {}),
    ...(extra ?? {}),
  };
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  extraMeta?: Record<string, unknown>,
): Response<ApiSuccess<T>> {
  const payload: ApiSuccess<T> = {
    success: true,
    data,
    meta: buildMeta(res.req, extraMeta),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  error: ApiErrorBody,
  extraMeta?: Record<string, unknown>,
): Response<ApiError> {
  const payload: ApiError = {
    success: false,
    error,
    meta: buildMeta(res.req, extraMeta),
  };
  return res.status(statusCode).json(payload);
}
