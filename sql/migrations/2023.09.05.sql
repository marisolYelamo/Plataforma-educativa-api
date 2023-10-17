CREATE TABLE "user_challenge" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "ContentId" int NOT NULL,
  "UserId" int NOT NULL,
  "ChallengeId" varchar(128) NOT NULL,
  "score" int NOT NULL,
  "tryNumber" int,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE "user_challenge" ADD FOREIGN KEY ("ContentId") REFERENCES "contents" ("id") ON DELETE CASCADE;
ALTER TABLE "user_challenge" ADD FOREIGN KEY ("UserId") REFERENCES "users" ("id") ON DELETE CASCADE;

