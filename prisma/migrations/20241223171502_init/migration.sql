/*
  Warnings:

  - The `image` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `media` column on the `Level` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `media` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `media` column on the `Solution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `media` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `media` column on the `Topic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "image",
ADD COLUMN     "image" JSONB;

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "media",
ADD COLUMN     "media" JSONB;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "media",
ADD COLUMN     "media" JSONB[];

-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "media",
ADD COLUMN     "media" JSONB[];

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "media",
ADD COLUMN     "media" JSONB;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "media",
ADD COLUMN     "media" JSONB;
