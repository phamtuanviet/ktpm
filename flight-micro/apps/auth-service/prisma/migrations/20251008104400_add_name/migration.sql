/*
  Warnings:

  - Added the required column `name` to the `AuthUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "name" TEXT NOT NULL;
