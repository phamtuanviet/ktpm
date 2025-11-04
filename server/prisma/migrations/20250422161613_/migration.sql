/*
  Warnings:

  - You are about to drop the column `cancellationDeadline` on the `Ticket` table. All the data in the column will be lost.
  - Made the column `passengerEmail` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "cancellationDeadline",
ALTER COLUMN "passengerEmail" SET NOT NULL;
