-- AlterTable
CREATE EXTENSION IF NOT EXISTS citext;
ALTER TABLE "AuthUser" ALTER COLUMN "email" SET DATA TYPE CITEXT,
ALTER COLUMN "name" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE INDEX "AuthUser_email_idx" ON "AuthUser"("email");

-- CreateIndex
CREATE INDEX "AuthUser_role_idx" ON "AuthUser"("role");

-- CreateIndex
CREATE INDEX "AuthUser_name_idx" ON "AuthUser"("name");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_tokenHash_idx" ON "RefreshToken"("tokenHash");
