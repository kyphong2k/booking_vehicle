export const routesOpenApiSchemas = {
  RouteDto: {
    type: 'object',
    required: [
      'id',
      'fromProvince',
      'toProvince',
      'distanceKm',
      'estimatedDurationMinutes',
      'isActive',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      id: { type: 'string', format: 'uuid' },
      fromProvince: { type: 'string' },
      toProvince: { type: 'string' },
      distanceKm: { type: 'integer', minimum: 0 },
      estimatedDurationMinutes: { type: 'integer', minimum: 0 },
      description: { type: 'string', nullable: true },
      isActive: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateRouteBody: {
    type: 'object',
    required: ['fromProvince', 'toProvince', 'distanceKm', 'estimatedDurationMinutes'],
    properties: {
      fromProvince: { type: 'string' },
      toProvince: { type: 'string' },
      distanceKm: { type: 'integer', minimum: 5 },
      estimatedDurationMinutes: { type: 'integer', minimum: 10 },
    },
  },
  ApiSuccessRoute: {
    type: 'object',
    required: ['success', 'data'],
    properties: {
      success: { type: 'boolean', const: true },
      data: { $ref: '#/components/schemas/RouteDto' },
    },
  },
  ApiSuccessRouteList: {
    type: 'object',
    required: ['success', 'data'],
    properties: {
      success: { type: 'boolean', const: true },
      data: { type: 'array', items: { $ref: '#/components/schemas/RouteDto' } },
    },
  },
} as const;
