/*
  Warnings:

  - Added the required column `tableNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `tableNumber` INTEGER NOT NULL;
