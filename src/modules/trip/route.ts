import { Router } from 'express';
import { createTrip, getTripById, listTrips } from './trip.controller';

export const tripsRouter = Router();

/**
 * @openapi
 * /trips:
 *   get:
 *     tags:
 *       - Trips
 *     summary: List trips
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema: { type: string }
 *       - in: query
 *         name: destination
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessTripList'
 */
tripsRouter.get('/', listTrips);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get trip by id
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
 *               $ref: '#/components/schemas/ApiSuccessTrip'
 *       404:
 *         description: Trip not found
 */
tripsRouter.get('/:id', getTripById);

/**
 * @openapi
 * /trips:
 *   post:
 *     tags:
 *       - Trips
 *     summary: Create trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripBody'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessTrip'
 */
tripsRouter.post('/', createTrip);
