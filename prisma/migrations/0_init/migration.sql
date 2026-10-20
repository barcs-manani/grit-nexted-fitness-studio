-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "membership_plans" (
    "id" BIGSERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" BIGSERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "emailAddress" VARCHAR(254) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "ageGroupId" BIGINT NOT NULL,
    "branchId" BIGINT NOT NULL,
    "membershipPlanId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "membership_plans_type_key" ON "membership_plans"("type");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;