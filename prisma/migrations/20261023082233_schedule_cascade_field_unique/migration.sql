/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `fitness_fields` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "schedule_times" DROP CONSTRAINT "schedule_times_scheduleId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "fitness_fields_name_key" ON "fitness_fields"("name");

-- AddForeignKey
ALTER TABLE "schedule_times" ADD CONSTRAINT "schedule_times_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
