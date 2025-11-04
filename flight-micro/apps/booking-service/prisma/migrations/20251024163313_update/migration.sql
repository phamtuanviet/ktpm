/*
  Warnings:

  - You are about to drop the column `bookedById` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `flightId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `UserRef` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `passengerId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_passengerId_fkey";

-- DropIndex
DROP INDEX "public"."Ticket_bookedById_idx";

-- DropIndex
DROP INDEX "public"."Ticket_flightId_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "bookedById",
DROP COLUMN "flightId",
ALTER COLUMN "passengerId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."UserRef";

-- CreateIndex
CREATE INDEX "Passenger_email_idx" ON "Passenger"("email");

-- CreateIndex
CREATE INDEX "Ticket_flightSeatId_idx" ON "Ticket"("flightSeatId");

-- CreateIndex
CREATE INDEX "Ticket_passengerId_idx" ON "Ticket"("passengerId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
