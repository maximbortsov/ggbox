/*
  Warnings:

  - You are about to drop the column `inStock` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Box` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "inStock",
DROP COLUMN "total";
