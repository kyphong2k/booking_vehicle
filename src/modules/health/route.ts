import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
healthRouter.get('/', (_req, res) => {
  return res.status(StatusCodes.OK).json({ success: true, data: { status: 'ok' } });
});

