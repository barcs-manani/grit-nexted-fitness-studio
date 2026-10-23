/*
  Warnings:

  - A unique constraint covering the columns `[period]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schedules_period_key" ON "schedules"("period");
