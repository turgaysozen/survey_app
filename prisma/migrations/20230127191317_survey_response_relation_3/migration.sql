/*
  Warnings:

  - You are about to drop the column `responseId` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `surveyId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_responseId_fkey";

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "surveyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "responseId";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
