import { Router } from 'express';
import { createTrip, getTripById, listTrips } from './trip.controller';

export const tripsRouter = Router();

/**
 * @openapi
 * /trips:
 *   get:
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
 */
tripsRouter.get('/', listTrips);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     summary: Get trip by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Trip not found
 */
tripsRouter.get('/:id', getTripById);

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [operatorName, origin, destination, departureTime, priceVnd, totalSeats, busType]
 *             properties:
 *               operatorName: { type: string, example: "Phuong Trang" }
 *               origin: { type: string, example: "HCM" }
 *               destination: { type: string, example: "Da Lat" }
 *               departureTime: { type: string, format: date-time, example: "2026-06-01T08:00:00Z" }
 *               arrivalTime: { type: string, format: date-time, example: "2026-06-01T12:00:00Z" }
 *               priceVnd: { type: integer, example: 350000 }
 *               totalSeats: { type: integer, example: 40 }
 *               busType:
 *                 type: string
 *                 enum: [SEATER, SLEEPER, LIMOUSINE]
 *                 example: SLEEPER
 *     responses:
 *       201:
 *         description: Created
 */
tripsRouter.post('/', createTrip);
