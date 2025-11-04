/*
  Warnings:

  - You are about to drop the column `flightId` on the `FlightSeat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seatClass]` on the table `FlightSeat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flightReferenceId` to the `FlightSeat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'DEPARTED', 'ARRIVED', 'CANCELLED', 'DELAYED');

-- DropIndex
DROP INDEX "public"."FlightSeat_flightId_idx";

-- DropIndex
DROP INDEX "public"."FlightSeat_flightId_seatClass_key";

-- AlterTable
ALTER TABLE "FlightSeat" DROP COLUMN "flightId",
ADD COLUMN     "flightReferenceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FlightReference" (
    "id" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "estimatedDeparture" TIMESTAMP(3),
    "estimatedArrival" TIMESTAMP(3),
    "aircraftName" TEXT NOT NULL,
    "status" "FlightStatus" NOT NULL,
    "departureAirportCode" TEXT NOT NULL,
    "arrivalAirportCode" TEXT NOT NULL,
    "departureAirportName" TEXT NOT NULL,
    "arrivalAirportName" TEXT NOT NULL,

    CONSTRAINT "FlightReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlightReference_flightNumber_idx" ON "FlightReference"("flightNumber");

-- CreateIndex
CREATE INDEX "FlightReference_departureTime_idx" ON "FlightReference"("departureTime");

-- CreateIndex
CREATE INDEX "FlightReference_arrivalTime_idx" ON "FlightReference"("arrivalTime");

-- CreateIndex
CREATE UNIQUE INDEX "FlightSeat_seatClass_key" ON "FlightSeat"("seatClass");

-- AddForeignKey
ALTER TABLE "FlightSeat" ADD CONSTRAINT "FlightSeat_flightReferenceId_fkey" FOREIGN KEY ("flightReferenceId") REFERENCES "FlightReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
