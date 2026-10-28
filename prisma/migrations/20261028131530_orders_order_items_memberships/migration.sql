-- AlterTable
ALTER TABLE "members" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "accountId" BIGINT NOT NULL,
    "paymentState" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "membershipPlanId" INTEGER NOT NULL,
    "membershipPriceId" INTEGER NOT NULL,
    "itemAmount" DECIMAL(10,2) NOT NULL,
    "totalPaid" DECIMAL(10,2),
    "currency" VARCHAR(5) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_memberships" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "primaryAccount" BOOLEAN NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "emailAddress" VARCHAR(254) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "ageGroupId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "membershipPlanId" INTEGER NOT NULL,

    CONSTRAINT "pending_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_accountId_idx" ON "orders"("accountId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "user_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_membershipPriceId_fkey" FOREIGN KEY ("membershipPriceId") REFERENCES "membership_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_memberships" ADD CONSTRAINT "pending_memberships_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_memberships" ADD CONSTRAINT "pending_memberships_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_memberships" ADD CONSTRAINT "pending_memberships_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "member_age_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_memberships" ADD CONSTRAINT "pending_memberships_membershipPlanId_fkey" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
