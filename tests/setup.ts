process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/booking_vehicle_test?schema=public';
process.env.REDIS_URL ??= 'redis://localhost:6379';
process.env.JWT_ACCESS_TOKEN_SECRET ??= 'test_access_secret_for_unit_tests_only_xxxxxx';
process.env.JWT_REFRESH_TOKEN_SECRET ??= 'test_refresh_secret_for_unit_tests_only_xxxxxx';
process.env.SWAGGER_ENABLED ??= 'false';
