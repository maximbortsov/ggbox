/*
  Warnings:

  - Changed the type of `flowId` on the `Edition` table.
  - Changed the type of `flowSetId` on the `Edition` table.
  - Changed the type of `flowPlayId` on the `Edition` table.
  - Changed the type of `flowID` on the `Nft` table.
  - Changed the type of `flowEditionID` on the `Nft` table.
  - Changed the type of `serialNumber` on the `Nft` table.
  - Changed the type of `flowId` on the `Play` table.
  - Changed the type of `flowId` on the `Set` table.

*/
-- AlterTable
ALTER TABLE "Edition"
    ALTER COLUMN "flowId" TYPE DECIMAL(20, 0) USING ("flowId"::DECIMAL),
    ALTER COLUMN "flowSetId" TYPE DECIMAL(20, 0) USING ("flowSetId"::DECIMAL),
    ALTER COLUMN "flowPlayId" TYPE DECIMAL(20, 0) USING ("flowPlayId"::DECIMAL);

-- AlterTable
ALTER TABLE "Nft"
    ALTER COLUMN "flowID" TYPE DECIMAL(20, 0) USING ("flowID"::DECIMAL),
    ALTER COLUMN "flowEditionID" TYPE DECIMAL(20, 0) USING ("flowEditionID"::DECIMAL),
    ALTER COLUMN "serialNumber" TYPE DECIMAL(20, 0) USING ("serialNumber"::DECIMAL);

-- AlterTable
ALTER TABLE "Play"
    ALTER COLUMN "flowId" TYPE DECIMAL(20, 0) USING ("flowId"::DECIMAL);

-- AlterTable
ALTER TABLE "Set"
    ALTER COLUMN "flowId" TYPE DECIMAL(20, 0) USING ("flowId"::DECIMAL);
