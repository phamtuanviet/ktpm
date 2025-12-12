CREATE EXTENSION IF NOT EXISTS citext;
-- AlterTable
ALTER TABLE "News" ALTER COLUMN "title" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE INDEX "News_isPublished_title_idx" ON "News"("isPublished", "title");

-- CreateIndex
CREATE INDEX "News_isDeleted_idx" ON "News"("isDeleted");

-- CreateIndex
CREATE INDEX "News_title_idx" ON "News"("title");
