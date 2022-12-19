/*
  Warnings:

  - You are about to drop the column `placeId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `place` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlaceEnum" AS ENUM ('AUDITORIO_PRINCIPAL', 'AUDITORIO_LATERAL', 'SALA_DE_WORKSHOP');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_placeId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "placeId",
ADD COLUMN     "place" "PlaceEnum" NOT NULL;

-- DropTable
DROP TABLE "Place";
