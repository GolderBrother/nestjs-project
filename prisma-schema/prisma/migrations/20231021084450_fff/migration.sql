/*
  Warnings:

  - You are about to drop the column `deaprtmentId` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[departmentId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departmentId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_deaprtmentId_fkey`;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `deaprtmentId`,
    ADD COLUMN `departmentId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_departmentId_key` ON `Employee`(`departmentId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
