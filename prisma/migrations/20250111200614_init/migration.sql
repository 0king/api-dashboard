/*
  Warnings:

  - You are about to drop the column `solutionId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Solution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "solutionId",
ADD COLUMN     "answers" TEXT[],
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "solutions" TEXT[];

-- DropTable
DROP TABLE "Solution";
