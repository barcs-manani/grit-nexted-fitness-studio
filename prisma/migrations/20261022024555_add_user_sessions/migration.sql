/*
  Warnings:

  - A unique constraint covering the columns `[emailAddress]` on the table `user_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "user_sessions" (
    "id" BIGSERIAL NOT NULL,
    "accountId" BIGINT NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_tokenHash_key" ON "user_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "user_sessions_accountId_idx" ON "user_sessions"("accountId");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_emailAddress_key" ON "user_accounts"("emailAddress");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
