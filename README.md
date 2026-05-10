# booking-vehicle-api

Backend Node.js (>=22) + Express + TypeScript, dùng Prisma/Postgres, Redis, Zod validation, JWT, Pino logging, Swagger và Docker Compose.

## Luồng chạy app (runtime flow)

### 1) Khởi động process

Entrypoint là `src/index.ts`:

- `import '@/config'` → `src/config/index.ts` gọi `dotenv.config()` để load `.env`.
- `getEnv()` từ `src/config/env.ts` đọc và **validate** `process.env` bằng Zod.
- Tạo Express app: `createApp()` trong `src/app/createApp.ts`.
- `app.listen(env.PORT)` và log “HTTP server started” (Pino trong `src/infrastructure/logger/pino.ts`).
- Bắt `SIGINT`/`SIGTERM` để `server.close()` rồi thoát.

### 2) Tạo Express app và middleware chain

`src/app/createApp.ts` tạo app và gắn middleware theo thứ tự:

- `helmet()` (security headers)
- `cors({ origin: true, credentials: true })`
- `express.json({ limit: '1mb' })` + `express.urlencoded(...)`
- `cookieParser()`
- `requestLogger` (`src/common/middleware/requestLogger.ts`, Pino HTTP)
- `registerRoutes(app)` — mount routers (xem `src/app/routes.ts`)
- `errorHandler` (`src/common/middleware/errorHandler.ts`) — format lỗi trả về thống nhất

### 3) Register routes + Swagger

`src/app/routes.ts`:

- `GET /health` → `src/modules/health/route.ts`
- `/trips` → `src/modules/trips/route.ts` (vd: list/create/get trip — chi tiết trong file route + Swagger)
- Nếu `SWAGGER_ENABLED=true`: OpenAPI spec bằng `swagger-jsdoc`, đọc annotation trong `src/modules/**/route.ts`, Swagger UI tại `/docs`

### 4) Format response / error

- Success: helper `sendSuccess` trong `src/common/utils/response.ts` — shape `{ success: true, data, meta? }`.
- Error: `errorHandler`:
  - **ZodError** → 400: `{ success: false, error: { code: "VALIDATION_ERROR", message, details } }`
  - **AppError** (`src/common/errors/AppError.ts`) → `statusCode` theo lỗi: `{ success: false, error: { code, message, details? } }`
  - Khác → 500: `{ success: false, error: { code: "INTERNAL_ERROR", message } }`

### Gợi ý module mới

Quy ước và checklist có trong `src/app/Guild.md` (nội bộ repo).

## Chạy dự án

### Local (recommended)

1. Copy env

```bash
cp .env.example .env
```

2. Cài dependency (repo dùng pnpm)

```bash
pnpm i
```

3. Chạy Postgres + Redis

```bash
docker compose up -d postgres redis
```

4. Migrate + generate Prisma Client

```bash
pnpm prisma:migrate:dev
pnpm prisma:generate
```

5. Chạy dev server

```bash
pnpm dev
```

### Docker Compose (api + postgres + redis)

```bash
docker compose up -d
```

Service `api` trong `docker-compose.yml` dùng `DATABASE_URL` trỏ host `postgres` và `REDIS_URL` trỏ `redis`.

## API docs

- Swagger UI: `GET /docs` (khi `SWAGGER_ENABLED=true`)
- Health: `GET /health`
- Trips: prefix `/trips` (xem `src/modules/trips/route.ts` và Swagger)

## Database & Prisma

### Prisma client nằm ở đâu?

- Schema: `prisma/schema.prisma`
- Prisma Client output: `src/infrastructure/prisma/generated`
- Export dùng trong code: `src/infrastructure/prisma/client.ts`, `src/infrastructure/prisma/index.ts`
- Kết nối Postgres: `@prisma/adapter-pg` + `DATABASE_URL` từ env (`src/infrastructure/prisma/client.ts`)

### Entities hiện có (Prisma models)

Trong `prisma/schema.prisma` hiện có:

- **`User`** — `role: UserRole`, quan hệ `refreshTokens`, `bookings`
- **`RefreshToken`** — liên kết `User`, cơ chế replacement (`replacedById`)
- **`Trip`** — chuyến xe; `busType: BusType`; quan hệ `seats`, `bookings`
- **`Seat`** — ghế theo trip; `status: SeatStatus`; unique `(tripId, seatNumber)`
- **`Booking`** — đặt chỗ; `status: BookingStatus`; liên kết `User`, `Trip`, `Seat`

Enum: `UserRole`, `BusType`, `SeatStatus`, `BookingStatus`.

## Khi thay đổi entity (Prisma model) thì luồng như thế nào?

Mọi thay đổi model bắt đầu từ `prisma/schema.prisma`.

### 1) Sửa schema

Sửa `prisma/schema.prisma` theo yêu cầu (field, relation, index, enum, …).

### 2) Tạo migration + cập nhật DB (dev)

```bash
pnpm prisma:migrate:dev
```

Lệnh này tạo migration trong `prisma/migrations/<timestamp>_*/` và apply lên DB dev. Sau đó nên chạy bước generate (bước 3).

### 3) Generate Prisma Client

```bash
pnpm prisma:generate
```

Kết quả cập nhật vào `src/infrastructure/prisma/generated`.

### 4) Cập nhật code phụ thuộc entity

Tùy thay đổi:

- Query/CRUD: chỗ gọi `prisma.*` (import từ `@/infrastructure/prisma` hoặc `client`)
- DTO / Zod: vd `src/modules/*/trip.schema.ts` hoặc schema tương ứng module
- Swagger: annotation trong `src/modules/**/route.ts`
- Migration dữ liệu / backfill nếu thêm NOT NULL hoặc đổi kiểu

### 5) Deploy / production

```bash
pnpm prisma:migrate:deploy
```

- `migrate dev`: local/dev, tạo migration.
- `migrate deploy`: CI/production, chỉ apply migration đã commit.

## Scripts

- `pnpm dev` — dev server (`tsx watch src/index.ts`)
- `pnpm build` — build TS → `dist/`
- `pnpm start` — chạy `node dist/index.js`
- `pnpm lint` — ESLint
- `pnpm format` — Prettier ghi file
- `pnpm test` — Vitest
- `pnpm prisma:migrate:dev` — tạo + apply migration (dev)
- `pnpm prisma:migrate:deploy` — apply migration (prod/CI)
- `pnpm prisma:generate` — generate Prisma Client
- `pnpm prisma:studio` — Prisma Studio
