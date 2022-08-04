/*
  Warnings:

  - You are about to drop the column `addressId` on the `clients` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `clients_addressId_fkey`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `clientId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clients` DROP COLUMN `addressId`;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
