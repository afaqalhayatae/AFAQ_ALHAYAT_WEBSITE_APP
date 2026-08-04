-- AlterTable
ALTER TABLE `User` ADD COLUMN `authProvider` ENUM('password', 'google', 'apple', 'facebook', 'phone_otp') NULL,
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `providerAccountId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `User_providerAccountId_idx` ON `User`(`providerAccountId`);
