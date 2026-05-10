/*
  Warnings:

  - Added the required column `arrival_time` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "arrival_time" TIMESTAMPTZ(6) NOT NULL;
