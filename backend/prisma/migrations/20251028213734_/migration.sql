/*
  Warnings:

  - Added the required column `cidade_id` to the `registros_os` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registros_os` ADD COLUMN `cidade_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `registros_os_cidade_id_idx` ON `registros_os`(`cidade_id`);

-- AddForeignKey
ALTER TABLE `registros_os` ADD CONSTRAINT `registros_os_cidade_id_fkey` FOREIGN KEY (`cidade_id`) REFERENCES `cidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
