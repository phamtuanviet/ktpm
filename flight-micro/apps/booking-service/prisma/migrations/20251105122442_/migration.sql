/*
  Warnings:

  - You are about to drop the column `flightReferenceId` on the `FlightSeat` table. All the data in the column will be lost.
  - You are about to drop the `FlightReference` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `flightId` to the `FlightSeat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FlightSeat" DROP CONSTRAINT "FlightSeat_flightReferenceId_fkey";

-- DropIndex
DROP INDEX "public"."Ticket_bookingReference_idx";

-- DropIndex
DROP INDEX "public"."Ticket_cancelCode_idx";

-- DropIndex
DROP INDEX "public"."Ticket_flightSeatId_idx";

-- DropIndex
DROP INDEX "public"."Ticket_passengerId_idx";

-- DropIndex
DROP INDEX "public"."Ticket_seatNumber_idx";

-- AlterTable
ALTER TABLE "FlightSeat" DROP COLUMN "flightReferenceId",
ADD COLUMN     "flightId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."FlightReference";

-- CreateIndex
CREATE INDEX "FlightSeat_flightId_idx" ON "FlightSeat"("flightId");

-- CreateIndex
CREATE INDEX "Ticket_flightSeatId_isCancelled_idx" ON "Ticket"("flightSeatId", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_passengerId_isCancelled_idx" ON "Ticket"("passengerId", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_bookingReference_isCancelled_idx" ON "Ticket"("bookingReference", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_cancelCode_isCancelled_idx" ON "Ticket"("cancelCode", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_seatNumber_isCancelled_idx" ON "Ticket"("seatNumber", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_bookedAt_isCancelled_idx" ON "Ticket"("bookedAt", "isCancelled");

-- CreateIndex
CREATE INDEX "Ticket_cancelAt_isCancelled_idx" ON "Ticket"("cancelAt", "isCancelled");
