declare global {
  namespace Express {
    interface Request {
      /** Set by {@link requestIdMiddleware} before request logging runs. */
      requestId?: string;
    }
  }
}

export {};
