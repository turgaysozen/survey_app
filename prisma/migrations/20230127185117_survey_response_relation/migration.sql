/*
  Warnings:

  - You are about to drop the column `surveyId` on the `Response` table. All the data in the column will be lost.
  - Added the required column `responseId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_surveyId_fkey";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "surveyId";

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "responseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
