ALTER TABLE "contents" ADD COLUMN "estimateTime" integer default 60;
ALTER TABLE "contents" ADD COLUMN "trackTime" integer default 30;

ALTER TABLE "user_topic" DROP COLUMN "count";
ALTER TABLE "user_content" DROP COLUMN "count";
