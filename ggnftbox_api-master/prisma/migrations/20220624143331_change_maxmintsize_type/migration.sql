/*
  Warnings:

  - Changed the type of `maxMintSize` on the `Edition` table.

*/
-- AlterTable
ALTER TABLE "Edition"
    ALTER COLUMN "maxMintSize" TYPE DECIMAL(20, 0) USING "maxMintSize"::DECIMAL;
