/*
  Warnings:

  - You are about to drop the column `passengerType` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Passenger" ADD COLUMN     "passengerType" "PassengerType" NOT NULL DEFAULT 'ADULT';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "passengerType",
ADD COLUMN     "cancelAt" TIMESTAMP(3);
