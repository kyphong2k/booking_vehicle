import { PrismaClient } from './generated';
import { PrismaPg } from '@prisma/adapter-pg';
import { getEnv } from '@/config/env';

const env = getEnv();
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

