/*
  Warnings:

  - Added the required column `customer_name` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route_id` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "customer_email" TEXT,
ADD COLUMN     "customer_name" TEXT NOT NULL,
ADD COLUMN     "customer_phone" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "route_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL,
    "from_province" TEXT NOT NULL,
    "to_province" TEXT NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "estimated_duration_minutes" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "routes_from_province_to_province_idx" ON "routes"("from_province", "to_province");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
