/*
  Warnings:

  - The primary key for the `Airport` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Flight" DROP CONSTRAINT "Flight_arrival_airport_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flight" DROP CONSTRAINT "Flight_departure_airport_id_fkey";

-- AlterTable
ALTER TABLE "Airport" DROP CONSTRAINT "Airport_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Airport_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Airport_id_seq";

-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "departure_airport_id" SET DATA TYPE TEXT,
ALTER COLUMN "arrival_airport_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Aircraft_name_idx" ON "Aircraft"("name");

-- CreateIndex
CREATE INDEX "Airport_iataCode_idx" ON "Airport"("iataCode");

-- CreateIndex
CREATE INDEX "Airport_icaoCode_idx" ON "Airport"("icaoCode");

-- CreateIndex
CREATE INDEX "Airport_name_idx" ON "Airport"("name");

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
