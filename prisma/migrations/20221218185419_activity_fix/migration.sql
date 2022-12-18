/*
  Warnings:

  - You are about to drop the column `eventId` on the `Activity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_eventId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "eventId";
