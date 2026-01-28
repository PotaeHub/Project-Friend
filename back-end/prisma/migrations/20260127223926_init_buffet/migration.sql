/*
  Warnings:

  - You are about to alter the column `paymentType` on the `bill` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to drop the column `customerQty` on the `buffetsession` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `buffetsession` table. All the data in the column will be lost.
  - You are about to drop the `package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tablesession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `buffetsession` DROP FOREIGN KEY `BuffetSession_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `sessionpackage` DROP FOREIGN KEY `SessionPackage_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `sessionpackage` DROP FOREIGN KEY `SessionPackage_sessionId_fkey`;

-- DropIndex
DROP INDEX `BuffetSession_packageId_fkey` ON `buffetsession`;

-- DropIndex
DROP INDEX `SessionPackage_packageId_fkey` ON `sessionpackage`;

-- DropIndex
DROP INDEX `SessionPackage_sessionId_fkey` ON `sessionpackage`;

-- AlterTable
ALTER TABLE `bill` MODIFY `paymentType` ENUM('CASH', 'QR', 'CARD') NOT NULL;

-- AlterTable
ALTER TABLE `buffetsession` DROP COLUMN `customerQty`,
    DROP COLUMN `packageId`;

-- DropTable
DROP TABLE `package`;

-- DropTable
DROP TABLE `tablesession`;

-- AddForeignKey
ALTER TABLE `SessionPackage` ADD CONSTRAINT `SessionPackage_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `BuffetSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionPackage` ADD CONSTRAINT `SessionPackage_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `BuffetPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
