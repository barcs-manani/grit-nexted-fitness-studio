/*
  Warnings:

  - The primary key for the `membership_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `monthlyPrice` on the `membership_plans` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `membership_plans` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the `registrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `membership_plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_membershipPlanId_fkey";

-- AlterTable
ALTER TABLE "membership_plans" DROP CONSTRAINT "membership_plans_pkey",
DROP COLUMN "monthlyPrice",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DATA TYPE INTEGER USING "id"::INTEGER,
ADD CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "registrations";

-- CreateTable
CREATE TABLE "membership_prices" (
    "id" SERIAL NOT NULL,
    "membershipPlanId" INTEGER NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "currency" VARCHAR(5) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "membership_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_perks" (
    "id" SERIAL NOT NULL,
    "membershipPlanId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "membership_perks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_age_groups" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "group" VARCHAR(30) NOT NULL,

    CONSTRAINT "member_age_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_locations" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR(150) NOT NULL,
    "city" VARCHAR(150) NOT NULL,

    CONSTRAINT "branch_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fitness_fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fitness_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" BIGSERIAL NOT NULL,
    "fullName" VARCHAR(250) NOT NULL,
    "emailAddress" VARCHAR(254) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "imageURL" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" BIGSERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "emailAddress" VARCHAR(254) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" BIGSERIAL NOT NULL,
    "accountId" BIGINT NOT NULL,
    "primaryAccount" BOOLEAN NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "emailAddress" VARCHAR(254) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "ageGroupId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "membershipPlanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "period" VARCHAR(30) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_times" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "time" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "schedule_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" SERIAL NOT NULL,
    "tag" VARCHAR(30) NOT NULL,
    "platform" VARCHAR(30) NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FitnessFieldToTrainer" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_FitnessFieldToTrainer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FitnessFieldToScheduleTime" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FitnessFieldToScheduleTime_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "membership_prices_membershipPlanId_period_currency_key" ON "membership_prices"("membershipPlanId", "period", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "membership_perks_membershipPlanId_name_key" ON "membership_perks"("membershipPlanId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "member_age_groups_type_group_key" ON "member_age_groups"("type", "group");

-- CreateIndex
CREATE UNIQUE INDEX "branch_locations_country_city_key" ON "branch_locations"("country", "city");

-- CreateIndex
CREATE INDEX "members_accountId_idx" ON "members"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "members_emailAddress_key" ON "members"("emailAddress");

-- CreateIndex
CREATE INDEX "_FitnessFieldToTrainer_B_index" ON "_FitnessFieldToTrainer"("B");

-- CreateIndex
CREATE INDEX "_FitnessFieldToScheduleTime_B_index" ON "_FitnessFieldToScheduleTime"("B");

-- AddForeignKey
ALTER TABLE "membership_prices" ADD CONSTRAINT "membership_prices_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_perks" ADD CONSTRAINT "membership_perks_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "user_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "member_age_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_times" ADD CONSTRAINT "schedule_times_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_FitnessFieldToTrainer" ADD CONSTRAINT "_FitnessFieldToTrainer_A_fkey" FOREIGN KEY ("A") REFERENCES "fitness_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FitnessFieldToTrainer" ADD CONSTRAINT "_FitnessFieldToTrainer_B_fkey" FOREIGN KEY ("B") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FitnessFieldToScheduleTime" ADD CONSTRAINT "_FitnessFieldToScheduleTime_A_fkey" FOREIGN KEY ("A") REFERENCES "fitness_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FitnessFieldToScheduleTime" ADD CONSTRAINT "_FitnessFieldToScheduleTime_B_fkey" FOREIGN KEY ("B") REFERENCES "schedule_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;
