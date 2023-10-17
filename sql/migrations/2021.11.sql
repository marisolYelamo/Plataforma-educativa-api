CREATE TABLE user_content (
    id SERIAL UNIQUE PRIMARY KEY,
    count integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "ContentId" integer
);

CREATE TABLE user_module (
    id SERIAL UNIQUE PRIMARY KEY,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "ModuleId" integer
);

CREATE TABLE user_topic (
    id SERIAL UNIQUE PRIMARY KEY,
    count integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "TopicId" integer
);

ALTER TABLE ONLY user_content
    ADD CONSTRAINT "user_content_UserId_ContentId_key" UNIQUE ("UserId", "ContentId");

ALTER TABLE ONLY user_content
    ADD CONSTRAINT user_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY user_module
    ADD CONSTRAINT "user_module_UserId_ModuleId_key" UNIQUE ("UserId", "ModuleId");

ALTER TABLE ONLY user_module
    ADD CONSTRAINT user_module_pkey PRIMARY KEY (id);

ALTER TABLE ONLY user_topic
    ADD CONSTRAINT "user_topic_UserId_TopicId_key" UNIQUE ("UserId", "TopicId");


ALTER TABLE ONLY user_topic
    ADD CONSTRAINT user_topic_pkey PRIMARY KEY (id);

ALTER TABLE ONLY user_content
    ADD CONSTRAINT "user_content_ContentId_fkey" FOREIGN KEY ("ContentId") REFERENCES contents(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY user_content
    ADD CONSTRAINT "user_content_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY user_module
    ADD CONSTRAINT "user_module_ModuleId_fkey" FOREIGN KEY ("ModuleId") REFERENCES modules(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY user_module
    ADD CONSTRAINT "user_module_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY user_topic
    ADD CONSTRAINT "user_topic_TopicId_fkey" FOREIGN KEY ("TopicId") REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY user_topic
    ADD CONSTRAINT "user_topic_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
