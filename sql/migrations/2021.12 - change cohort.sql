CREATE TABLE "cohort" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "label" varchar(50) UNIQUE NOT NULL,
  "roleId" int NOT NULL,
  "discordId" varchar(128) UNIQUE,
  "discordRoleId"  varchar(128) UNIQUE,
  "discordChannelsIds" varchar(128)[] DEFAULT array[]::varchar[],
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "commission" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "cohortId" int NOT NULL,
  "discordRoleId"  varchar(128) UNIQUE,
  "discordChannelsIds" varchar(128)[] DEFAULT array[]::varchar[],
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "user_commission" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "CommissionId" int NOT NULL,
  "UserId" int NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE "cohort" ADD FOREIGN KEY ("roleId") REFERENCES "roles" ("id");

ALTER TABLE "commission" ADD FOREIGN KEY ("cohortId") REFERENCES "cohort" ("id") ON DELETE CASCADE;

ALTER TABLE "user_commission" ADD FOREIGN KEY ("CommissionId") REFERENCES "commission" ("id") ON DELETE CASCADE;

ALTER TABLE "user_commission" ADD FOREIGN KEY ("UserId") REFERENCES "users" ("id") ON DELETE CASCADE;
