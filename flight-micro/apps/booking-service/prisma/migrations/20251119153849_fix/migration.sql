CREATE EXTENSION IF NOT EXISTS citext;
-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_flightSeatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_passengerId_fkey";

-- AlterTable
ALTER TABLE "FlightSeat" ALTER COLUMN "flightId" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "Passenger" ALTER COLUMN "fullName" SET DATA TYPE CITEXT,
ALTER COLUMN "email" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "bookingReference" SET DATA TYPE CITEXT,
ALTER COLUMN "cancelCode" SET DATA TYPE CITEXT,
ALTER COLUMN "seatNumber" SET DATA TYPE CITEXT,
ALTER COLUMN "flightSeatId" SET DATA TYPE CITEXT,
ALTER COLUMN "passengerId" SET DATA TYPE CITEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_flightSeatId_fkey" FOREIGN KEY ("flightSeatId") REFERENCES "FlightSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
