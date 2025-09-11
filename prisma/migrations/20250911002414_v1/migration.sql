-- DropForeignKey
ALTER TABLE `business` DROP FOREIGN KEY `Business_subscriptionPlanId_fkey`;

-- DropIndex
DROP INDEX `Business_subscriptionPlanId_fkey` ON `business`;

-- AlterTable
ALTER TABLE `business` MODIFY `rif` VARCHAR(191) NULL,
    MODIFY `subscriptionPlanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_subscriptionPlanId_fkey` FOREIGN KEY (`subscriptionPlanId`) REFERENCES `SubscriptionPlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
