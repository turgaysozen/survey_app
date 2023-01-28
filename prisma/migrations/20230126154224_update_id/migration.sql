-- AlterTable
CREATE SEQUENCE form_id_seq;
ALTER TABLE "Form" ALTER COLUMN "id" SET DEFAULT nextval('form_id_seq');
ALTER SEQUENCE form_id_seq OWNED BY "Form"."id";

-- AlterTable
CREATE SEQUENCE option_id_seq;
ALTER TABLE "Option" ALTER COLUMN "id" SET DEFAULT nextval('option_id_seq');
ALTER SEQUENCE option_id_seq OWNED BY "Option"."id";

-- AlterTable
CREATE SEQUENCE question_id_seq;
ALTER TABLE "Question" ALTER COLUMN "id" SET DEFAULT nextval('question_id_seq');
ALTER SEQUENCE question_id_seq OWNED BY "Question"."id";
