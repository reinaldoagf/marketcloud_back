-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
