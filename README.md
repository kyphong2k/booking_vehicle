# booking-vehicle-api

Feature-based Node.js (22+) + Express + TypeScript backend with Prisma/Postgres, Redis, BullMQ, Zod validation, JWT auth (refresh rotation), Pino logging, Swagger, and Docker Compose.

## Quick start (local)

1) Copy env

```bash
cp .env.example .env
```

2) Install deps

```bash
npm i
```

3) Start Postgres + Redis

```bash
docker compose up -d postgres redis
```

4) Migrate + generate

```bash
npm run prisma:migrate:dev
```

5) Run dev server

```bash
npm run dev
```

## API docs

- Swagger UI: `GET /docs`
- Health: `GET /health`

