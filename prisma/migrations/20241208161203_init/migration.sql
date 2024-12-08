-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_id_fkey";

-- DropIndex
DROP INDEX "Topic_parentTopicId_key";

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parentTopicId_fkey" FOREIGN KEY ("parentTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
