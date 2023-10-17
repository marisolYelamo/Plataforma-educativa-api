CREATE TABLE "user_feedback" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "ContentId" int NOT NULL,
  "UserId" int NOT NULL,
  "ranking" int,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE "user_feedback" ADD FOREIGN KEY ("ContentId") REFERENCES "contents" ("id") ON DELETE CASCADE;
ALTER TABLE "user_feedback" ADD FOREIGN KEY ("UserId") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE user_feedback ADD CONSTRAINT unique_user_content UNIQUE ("UserId", "ContentId");