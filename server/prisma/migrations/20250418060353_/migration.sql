/*
  Warnings:

  - The primary key for the `Aircraft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Flight` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_aircraftId_fkey";

-- DropForeignKey
ALTER TABLE "FlightSeat" DROP CONSTRAINT "FlightSeat_flightId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_flightId_fkey";

-- AlterTable
ALTER TABLE "Aircraft" DROP CONSTRAINT "Aircraft_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Aircraft_id_seq";

-- AlterTable
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "aircraftId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Flight_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Flight_id_seq";

-- AlterTable
ALTER TABLE "FlightSeat" ALTER COLUMN "flightId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "flightId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSeat" ADD CONSTRAINT "FlightSeat_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
