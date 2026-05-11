import { Router } from 'express';

export const routesRouter = Router();

/**
 * @openapi
 * /routes:
 *   get:
 *     tags:
 *       - Routes
 *     summary: Get all routes
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessRouteList'
 */
routesRouter.get('/');

/**
 * @openapi
 * /routes/{id}:
 *   get:
 *     tags:
 *       - Routes
 *     summary: Get route by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessRoute'
 *       404:
 *         description: Route not found
 */
routesRouter.get('/:id');
