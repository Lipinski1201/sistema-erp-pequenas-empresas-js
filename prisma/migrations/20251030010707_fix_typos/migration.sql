/*
  Warnings:

  - You are about to drop the column `paymetMethod` on the `sales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sales" DROP COLUMN "paymetMethod",
ADD COLUMN     "paymentMethod" TEXT;
