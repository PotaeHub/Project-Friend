/*
  Warnings:

  - Added the required column `round` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `round` INTEGER NOT NULL;
