/*
  Warnings:

  - Changed the type of `name` on the `Aircraft` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `manufacturer` on the `Aircraft` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Airport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `iataCode` on the `Airport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `icaoCode` on the `Airport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `city` on the `Airport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `flightNumber` on the `Flight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
CREATE EXTENSION IF NOT EXISTS citext;

-- DropForeignKey
ALTER TABLE "public"."Flight" DROP CONSTRAINT "Flight_arrival_airport_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flight" DROP CONSTRAINT "Flight_departure_airport_id_fkey";

-- AlterTable
ALTER TABLE "Aircraft" DROP COLUMN "name",
ADD COLUMN     "name" CITEXT NOT NULL,
DROP COLUMN "manufacturer",
ADD COLUMN     "manufacturer" CITEXT NOT NULL;

-- AlterTable
ALTER TABLE "Airport" DROP COLUMN "name",
ADD COLUMN     "name" CITEXT NOT NULL,
DROP COLUMN "iataCode",
ADD COLUMN     "iataCode" CITEXT NOT NULL,
DROP COLUMN "icaoCode",
ADD COLUMN     "icaoCode" CITEXT NOT NULL,
DROP COLUMN "city",
ADD COLUMN     "city" CITEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "flightNumber",
ADD COLUMN     "flightNumber" CITEXT NOT NULL,
ALTER COLUMN "departure_airport_id" SET DATA TYPE CITEXT,
ALTER COLUMN "arrival_airport_id" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_name_key" ON "Aircraft"("name");

-- CreateIndex
CREATE INDEX "Aircraft_name_idx" ON "Aircraft"("name");

-- CreateIndex
CREATE INDEX "Aircraft_manufacturer_idx" ON "Aircraft"("manufacturer");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iataCode_key" ON "Airport"("iataCode");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icaoCode_key" ON "Airport"("icaoCode");

-- CreateIndex
CREATE INDEX "Airport_iataCode_idx" ON "Airport"("iataCode");

-- CreateIndex
CREATE INDEX "Airport_icaoCode_idx" ON "Airport"("icaoCode");

-- CreateIndex
CREATE INDEX "Airport_name_idx" ON "Airport"("name");

-- CreateIndex
CREATE INDEX "Airport_city_idx" ON "Airport"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flightNumber_key" ON "Flight"("flightNumber");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_flightNumber_idx" ON "Flight"("sagaStatus", "flightNumber");

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
