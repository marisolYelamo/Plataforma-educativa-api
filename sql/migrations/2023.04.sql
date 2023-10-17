CREATE TABLE "user_entries" (
    "id" SERIAL UNIQUE PRIMARY KEY,
    "UserId" integer,
    "ContentId" integer,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "user_entries" ADD FOREIGN KEY ("ContentId") REFERENCES "contents" ("id") ON DELETE CASCADE;
ALTER TABLE "user_entries" ADD FOREIGN KEY ("UserId") REFERENCES "users" ("id") ON DELETE CASCADE;
