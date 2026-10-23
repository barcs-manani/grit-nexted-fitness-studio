/*
  Warnings:

  - A unique constraint covering the columns `[emailAddress]` on the table `trainers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "trainers_emailAddress_idx" ON "trainers"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_emailAddress_key" ON "trainers"("emailAddress");
