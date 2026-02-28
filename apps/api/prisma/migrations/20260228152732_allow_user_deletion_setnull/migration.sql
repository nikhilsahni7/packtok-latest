-- DropForeignKey
ALTER TABLE "service_action_logs" DROP CONSTRAINT "service_action_logs_actorId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_createdById_fkey";

-- AlterTable
ALTER TABLE "service_action_logs" ALTER COLUMN "actorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_action_logs" ADD CONSTRAINT "service_action_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
