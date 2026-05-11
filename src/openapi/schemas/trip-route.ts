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
