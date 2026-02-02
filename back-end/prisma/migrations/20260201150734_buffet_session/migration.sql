/*
  Warnings:

  - You are about to drop the column `tableNumber` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `bill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bill` DROP FOREIGN KEY `Bill_sessionId_fkey`;

-- AlterTable
ALTER TABLE `buffetpackage` MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `menu` MODIFY `price` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `tableNumber`;

-- DropTable
DROP TABLE `bill`;

-- CreateTable
CREATE TABLE `PaymentSlip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buffetSessionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentSlip` ADD CONSTRAINT `PaymentSlip_buffetSessionId_fkey` FOREIGN KEY (`buffetSessionId`) REFERENCES `BuffetSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
