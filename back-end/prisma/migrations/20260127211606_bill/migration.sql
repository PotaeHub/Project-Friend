-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `paidAmount` INTEGER NOT NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Bill_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `BuffetSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
