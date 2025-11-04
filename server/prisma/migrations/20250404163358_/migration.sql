/*
  Warnings:

  - Made the column `iataCode` on table `Airport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icaoCode` on table `Airport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Airport" ALTER COLUMN "iataCode" SET NOT NULL,
ALTER COLUMN "icaoCode" SET NOT NULL;
