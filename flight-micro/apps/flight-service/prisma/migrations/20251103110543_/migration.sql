/*
  Warnings:

  - The values [COMPLETED] on the enum `SagaStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SagaStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');
ALTER TABLE "public"."Flight" ALTER COLUMN "sagaStatus" DROP DEFAULT;
ALTER TABLE "Flight" ALTER COLUMN "sagaStatus" TYPE "SagaStatus_new" USING ("sagaStatus"::text::"SagaStatus_new");
ALTER TYPE "SagaStatus" RENAME TO "SagaStatus_old";
ALTER TYPE "SagaStatus_new" RENAME TO "SagaStatus";
DROP TYPE "public"."SagaStatus_old";
ALTER TABLE "Flight" ALTER COLUMN "sagaStatus" SET DEFAULT 'PENDING';
COMMIT;
