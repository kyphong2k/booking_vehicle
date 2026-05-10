import { Router } from 'express';

export const routesRouter = Router();

/**
 * @openapi
 * /routes:
 *   get:
 *     summary: Get all routes
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   deletedAt:
 *                     type: string
 *                     format: date-time
 *                   isActive:
 *                     type: boolean
 *                   isDeleted:
 *                     type: boolean
 *                   isArchived:
 *                     type: boolean
 */
routesRouter.get('/');
