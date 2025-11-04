/*
  Warnings:

  - The values [INFANT] on the enum `PassengerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PassengerType_new" AS ENUM ('ADULT', 'CHILD', 'INFRANT');
ALTER TABLE "Ticket" ALTER COLUMN "passengerType" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "passengerType" TYPE "PassengerType_new" USING ("passengerType"::text::"PassengerType_new");
ALTER TYPE "PassengerType" RENAME TO "PassengerType_old";
ALTER TYPE "PassengerType_new" RENAME TO "PassengerType";
DROP TYPE "PassengerType_old";
ALTER TABLE "Ticket" ALTER COLUMN "passengerType" SET DEFAULT 'ADULT';
COMMIT;
