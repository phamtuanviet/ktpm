-- AlterTable
ALTER TABLE "Aircraft" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Aircraft_manufacturer_idx" ON "Aircraft"("manufacturer");
