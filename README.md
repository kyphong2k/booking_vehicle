# booking-vehicle-api

Backend Node.js (>=22) + Express + TypeScript, dùng Prisma/Postgres, Redis, Zod validation, JWT, Pino logging, Swagger và Docker Compose.

## Luồng chạy app (runtime flow)

### 1) Khởi động process

Entrypoint là `src/index.ts`:

- Load env bằng `import '@/config'` (dotenv) → đọc/validate env qua `getEnv()` (Zod).
- Tạo Express app: `createApp()`.
- `app.listen(env.PORT)` và log “HTTP server started”.
- Bắt `SIGINT`/`SIGTERM` để `server.close()` rồi thoát.

### 2) Tạo Express app và middleware chain

`src/app/createApp.ts` tạo app và gắn middleware theo thứ tự:

- `helmet()` (security headers)
- `cors({ origin: true, credentials: true })`
- `express.json({ limit: '1mb' })` + `express.urlencoded(...)`
- `cookieParser()`
- `requestLogger` (Pino HTTP) để log request/response
- `registerRoutes(app)` để mount routers (vd: `/health`, `/docs`)
- `errorHandler` (catch-all error middleware) để format lỗi trả về thống nhất

### 3) Register routes + Swagger

`src/app/routes.ts`:

- Mount `healthRouter` tại `/health`
- Nếu `SWAGGER_ENABLED=true` thì tạo OpenAPI spec bằng `swagger-jsdoc` từ annotation trong `src/modules/**/route.ts` và mount Swagger UI tại `/docs`

### 4) Format response / error

- Success response thường theo shape:
  - `{ "success": true, "data": ..., "meta"?: ... }` (helper ở `src/common/utils/response.ts`)
- Error response do `errorHandler` trả:
  - **ZodError** → 400:
    - `{ success:false, error:{ code:"VALIDATION_ERROR", message:"Validation error", details: ... } }`
  - **AppError** (`src/common/errors/AppError.ts`) → statusCode theo error:
    - `{ success:false, error:{ code, message, details? } }`
  - Lỗi khác → 500:
    - `{ success:false, error:{ code:"INTERNAL_ERROR", message } }`

## Chạy dự án

### Local (recommended)

1) Copy env

```bash
cp .env.example .env
```

2) Install deps (repo đang dùng pnpm)

```bash
pnpm i
```

3) Start Postgres + Redis

```bash
docker compose up -d postgres redis
```

4) Migrate + generate Prisma Client

```bash
pnpm prisma:migrate:dev
pnpm prisma:generate
```

5) Run dev server

```bash
pnpm dev
```

### Docker Compose (api + postgres + redis)

```bash
docker compose up -d
```

Ghi chú: service `api` trong `docker-compose.yml` dùng `DATABASE_URL` trỏ tới host `postgres` và `REDIS_URL` trỏ tới `redis`.

## API docs

- Swagger UI: `GET /docs` (khi `SWAGGER_ENABLED=true`)
- Health: `GET /health`

## Database & Prisma

### Prisma client nằm ở đâu?

- Schema chính: `prisma/schema.prisma`
- Prisma Client output vào: `src/infrastructure/prisma/generated`
- Prisma client wrapper export: `src/infrastructure/prisma/client.ts` và `src/infrastructure/prisma/index.ts`
- Kết nối Postgres dùng `@prisma/adapter-pg` (PrismaPg) và lấy `DATABASE_URL` từ env

### Entities hiện có (Prisma models)

Trong `prisma/schema.prisma` hiện có:

- `User` (có `role: UserRole`, `refreshTokens`, `orders`)
- `RefreshToken` (liên kết `User`, có cơ chế replacement)
- `Product`
- `Order` (liên kết `User`, `status: OrderStatus`)

## Khi thay đổi entity (Prisma model) thì luồng như thế nào?

Mọi “entity change” (thêm/sửa/xoá field, đổi relation, thêm index/enum/model) bắt đầu từ `prisma/schema.prisma`.

### 1) Sửa schema

Sửa `prisma/schema.prisma` theo yêu cầu (vd: thêm field, đổi kiểu, thêm relation).

### 2) Tạo migration + cập nhật DB (dev)

```bash
pnpm prisma:migrate:dev
```

Lệnh này sẽ:

- Tạo migration mới trong `prisma/migrations/<timestamp>_*`
- Apply migration lên database dev
- (thường) chạy generate Prisma Client (tuỳ config prisma version; repo có script riêng, nên vẫn khuyến nghị chạy bước 3)

### 3) Generate Prisma Client

```bash
pnpm prisma:generate
```

Kết quả được viết vào `src/infrastructure/prisma/generated`. Đây là nơi TypeScript types và client methods được cập nhật theo schema mới.

### 4) Cập nhật code phụ thuộc entity

Tuỳ mức độ thay đổi, các điểm hay cần sửa:

- **Query/CRUD code**: nơi gọi `prisma.<model>.*` (import `prisma` từ `src/infrastructure/prisma`)
- **DTO/validation**: các schema Zod (nếu module đó có validate input/output)
- **API contract**: Swagger annotations trong `src/modules/**/route.ts`
- **Migration data/backfill**: nếu thêm field NOT NULL hoặc đổi kiểu cần dữ liệu chuyển đổi

### 5) Deploy / môi trường production

Khi deploy production, dùng migrate kiểu “deploy”:

```bash
pnpm prisma:migrate:deploy
```

Nguyên tắc:

- `migrate dev` dùng cho local/dev để tạo migration.
- `migrate deploy` dùng cho CI/production để apply migration đã commit sẵn.

## Scripts

- `pnpm dev`: chạy dev server (`tsx watch src/index.ts`)
- `pnpm build`: build TypeScript → `dist/`
- `pnpm start`: chạy production build
- `pnpm prisma:migrate:dev`: tạo + apply migration ở dev
- `pnpm prisma:migrate:deploy`: apply migration ở prod/CI
- `pnpm prisma:generate`: generate Prisma Client
- `pnpm prisma:studio`: mở Prisma Studio

