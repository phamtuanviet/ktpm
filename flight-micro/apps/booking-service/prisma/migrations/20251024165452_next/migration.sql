/*
  Warnings:

  - The primary key for the `FlightSeat` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_flightSeatId_fkey";

-- AlterTable
ALTER TABLE "FlightSeat" DROP CONSTRAINT "FlightSeat_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FlightSeat_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FlightSeat_id_seq";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "flightSeatId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_flightSeatId_fkey" FOREIGN KEY ("flightSeatId") REFERENCES "FlightSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
