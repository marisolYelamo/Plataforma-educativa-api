--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: contentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."contentStatus" AS ENUM (
    'active',
    'inactive',
    'editing'
);


ALTER TYPE public."contentStatus" OWNER TO postgres;

--
-- Name: enum_modules_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_modules_type AS ENUM (
    'class',
    'workshop',
    'assignment'
);


ALTER TYPE public.enum_modules_type OWNER TO postgres;

--
-- Name: enum_permissions_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_permissions_type AS ENUM (
    'read',
    'create',
    'delete',
    'edit'
);


ALTER TYPE public.enum_permissions_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cohort; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cohort (
    id integer NOT NULL,
    label character varying(50) NOT NULL,
    "roleId" integer NOT NULL,
    "discordId" character varying(128),
    "discordRoleId" character varying(128),
    "discordChannelsIds" character varying(128)[] DEFAULT ARRAY[]::character varying[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.cohort OWNER TO postgres;

--
-- Name: cohort_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cohort_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cohort_id_seq OWNER TO postgres;

--
-- Name: cohort_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cohort_id_seq OWNED BY public.cohort.id;


--
-- Name: commission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commission (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "cohortId" integer NOT NULL,
    "discordRoleId" character varying(128),
    "discordChannelsIds" character varying(128)[] DEFAULT ARRAY[]::character varying[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.commission OWNER TO postgres;

--
-- Name: commission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commission_id_seq OWNER TO postgres;

--
-- Name: commission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commission_id_seq OWNED BY public.commission.id;


--
-- Name: content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content (
    id integer NOT NULL,
    span integer DEFAULT 0 NOT NULL,
    title character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    visibility boolean DEFAULT true,
    status public."contentStatus" DEFAULT 'editing'::public."contentStatus",
    "topicId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(2)
);


ALTER TABLE public.content OWNER TO postgres;

--
-- Name: content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.content_id_seq OWNER TO postgres;

--
-- Name: content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.content_id_seq OWNED BY public.content.id;


--
-- Name: contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contents (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    slug character varying(255),
    span integer,
    "contentHtml" text,
    "contentMarkdown" text,
    "topicId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    visibility boolean
);


ALTER TABLE public.contents OWNER TO postgres;

--
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contents_id_seq OWNER TO postgres;

--
-- Name: contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contents_id_seq OWNED BY public.contents.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    span integer,
    title character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    description text,
    duration character varying(128),
    image character varying(128),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: fragmentType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."fragmentType" (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public."fragmentType" OWNER TO postgres;

--
-- Name: fragmentType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."fragmentType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."fragmentType_id_seq" OWNER TO postgres;

--
-- Name: fragmentType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."fragmentType_id_seq" OWNED BY public."fragmentType".id;


--
-- Name: hintFragment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."hintFragment" (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    title character varying(128) NOT NULL,
    content text NOT NULL,
    "typeId" integer NOT NULL,
    span integer DEFAULT 0 NOT NULL,
    "contentId" integer NOT NULL
);


ALTER TABLE public."hintFragment" OWNER TO postgres;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    span integer,
    title character varying(128) NOT NULL,
    slug character varying(128),
    description text DEFAULT 'Description'::text,
    type public.enum_modules_type DEFAULT 'workshop'::public.enum_modules_type NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    visibility boolean
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modules_id_seq OWNER TO postgres;

--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: multipleChoiceFragment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."multipleChoiceFragment" (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    question character varying NOT NULL,
    options character varying[] NOT NULL,
    answer integer NOT NULL,
    "typeId" integer NOT NULL,
    span integer DEFAULT 0 NOT NULL,
    "contentId" integer NOT NULL
);


ALTER TABLE public."multipleChoiceFragment" OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id integer NOT NULL,
    amount integer NOT NULL,
    currency character varying(255) NOT NULL,
    discount integer,
    course character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_id_seq OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;


--
-- Name: permission_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission_courses (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "PermissionId" integer NOT NULL,
    "CourseId" integer NOT NULL
);


ALTER TABLE public.permission_courses OWNER TO postgres;

--
-- Name: permission_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission_roles (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "RoleId" integer NOT NULL,
    "PermissionId" integer NOT NULL
);


ALTER TABLE public.permission_roles OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    type public.enum_permissions_type DEFAULT 'read'::public.enum_permissions_type,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    link character varying(256) NOT NULL,
    "moduleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resources_id_seq OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(128),
    color character varying(128),
    "accessLevel" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: textFragment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."textFragment" (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    html text NOT NULL,
    "typeId" integer NOT NULL,
    span integer DEFAULT 0 NOT NULL,
    "contentId" integer NOT NULL
);


ALTER TABLE public."textFragment" OWNER TO postgres;

--
-- Name: topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    span integer,
    title character varying(128) NOT NULL,
    slug character varying(255) NOT NULL,
    "moduleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    visibility boolean
);


ALTER TABLE public.topics OWNER TO postgres;

--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO postgres;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: user_commission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_commission (
    id integer NOT NULL,
    "CommissionId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.user_commission OWNER TO postgres;

--
-- Name: user_commission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_commission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_commission_id_seq OWNER TO postgres;

--
-- Name: user_commission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_commission_id_seq OWNED BY public.user_commission.id;


--
-- Name: user_commissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_commissions (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "CommissionId" integer NOT NULL,
    "UserId" integer NOT NULL
);


ALTER TABLE public.user_commissions OWNER TO postgres;

--
-- Name: user_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_content (
    id integer NOT NULL,
    count integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "ContentId" integer
);


ALTER TABLE public.user_content OWNER TO postgres;

--
-- Name: user_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_content_id_seq OWNER TO postgres;

--
-- Name: user_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_content_id_seq OWNED BY public.user_content.id;


--
-- Name: user_module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_module (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "ModuleId" integer
);


ALTER TABLE public.user_module OWNER TO postgres;

--
-- Name: user_module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_module_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_module_id_seq OWNER TO postgres;

--
-- Name: user_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_module_id_seq OWNED BY public.user_module.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer NOT NULL,
    "RoleId" integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_topic (
    id integer NOT NULL,
    count integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "TopicId" integer
);


ALTER TABLE public.user_topic OWNER TO postgres;

--
-- Name: user_topic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_topic_id_seq OWNER TO postgres;

--
-- Name: user_topic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_topic_id_seq OWNED BY public.user_topic.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "firstName" character varying(128) NOT NULL,
    "lastName" character varying(128) NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(128) NOT NULL,
    phone character varying(128) DEFAULT ''::character varying,
    active boolean DEFAULT false,
    birthdate timestamp with time zone,
    country character varying(128) DEFAULT ''::character varying,
    knowledge character varying(128) DEFAULT ''::character varying,
    city character varying(128) DEFAULT ''::character varying,
    salt character varying(128),
    "activeToken" character varying(256) DEFAULT ''::character varying,
    "resetToken" character varying(256) DEFAULT ''::character varying,
    "resetPassIsused" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "discordId" character varying(128),
    "discordTag" character varying(128)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cohort id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort ALTER COLUMN id SET DEFAULT nextval('public.cohort_id_seq'::regclass);


--
-- Name: commission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission ALTER COLUMN id SET DEFAULT nextval('public.commission_id_seq'::regclass);


--
-- Name: content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content ALTER COLUMN id SET DEFAULT nextval('public.content_id_seq'::regclass);


--
-- Name: contents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents ALTER COLUMN id SET DEFAULT nextval('public.contents_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: fragmentType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fragmentType" ALTER COLUMN id SET DEFAULT nextval('public."fragmentType_id_seq"'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: user_commission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commission ALTER COLUMN id SET DEFAULT nextval('public.user_commission_id_seq'::regclass);


--
-- Name: user_content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_content ALTER COLUMN id SET DEFAULT nextval('public.user_content_id_seq'::regclass);


--
-- Name: user_module id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module ALTER COLUMN id SET DEFAULT nextval('public.user_module_id_seq'::regclass);


--
-- Name: user_topic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_topic ALTER COLUMN id SET DEFAULT nextval('public.user_topic_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: cohort cohort_discordId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort
    ADD CONSTRAINT "cohort_discordId_key" UNIQUE ("discordId");


--
-- Name: cohort cohort_discordRoleId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort
    ADD CONSTRAINT "cohort_discordRoleId_key" UNIQUE ("discordRoleId");


--
-- Name: cohort cohort_label_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort
    ADD CONSTRAINT cohort_label_key UNIQUE (label);


--
-- Name: cohort cohort_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort
    ADD CONSTRAINT cohort_pkey PRIMARY KEY (id);


--
-- Name: commission commission_discordRoleId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission
    ADD CONSTRAINT "commission_discordRoleId_key" UNIQUE ("discordRoleId");


--
-- Name: commission commission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission
    ADD CONSTRAINT commission_pkey PRIMARY KEY (id);


--
-- Name: content content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT content_pkey PRIMARY KEY (id);


--
-- Name: content content_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT content_slug_key UNIQUE (slug);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: contents contents_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_slug_key UNIQUE (slug);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: courses courses_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_title_key UNIQUE (title);


--
-- Name: fragmentType fragmentType_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fragmentType"
    ADD CONSTRAINT "fragmentType_name_key" UNIQUE (name);


--
-- Name: fragmentType fragmentType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."fragmentType"
    ADD CONSTRAINT "fragmentType_pkey" PRIMARY KEY (id);


--
-- Name: hintFragment hintFragment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_pkey" PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: multipleChoiceFragment multipleChoiceFragment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_pkey" PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: permission_courses permission_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_courses
    ADD CONSTRAINT permission_courses_pkey PRIMARY KEY ("PermissionId", "CourseId");


--
-- Name: permission_roles permission_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_roles
    ADD CONSTRAINT permission_roles_pkey PRIMARY KEY ("RoleId", "PermissionId");


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: textFragment textFragment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."textFragment"
    ADD CONSTRAINT "textFragment_pkey" PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: topics topics_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_slug_key UNIQUE (slug);


--
-- Name: user_commission user_commission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commission
    ADD CONSTRAINT user_commission_pkey PRIMARY KEY (id);


--
-- Name: user_commissions user_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commissions
    ADD CONSTRAINT user_commissions_pkey PRIMARY KEY ("CommissionId", "UserId");


--
-- Name: user_content user_content_UserId_ContentId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_content
    ADD CONSTRAINT "user_content_UserId_ContentId_key" UNIQUE ("UserId", "ContentId");


--
-- Name: user_content user_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_content
    ADD CONSTRAINT user_content_pkey PRIMARY KEY (id);


--
-- Name: user_module user_module_UserId_ModuleId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module
    ADD CONSTRAINT "user_module_UserId_ModuleId_key" UNIQUE ("UserId", "ModuleId");


--
-- Name: user_module user_module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module
    ADD CONSTRAINT user_module_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY ("UserId", "RoleId");


--
-- Name: user_topic user_topic_UserId_TopicId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_topic
    ADD CONSTRAINT "user_topic_UserId_TopicId_key" UNIQUE ("UserId", "TopicId");


--
-- Name: user_topic user_topic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_topic
    ADD CONSTRAINT user_topic_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cohort cohort_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cohort
    ADD CONSTRAINT "cohort_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id);


--
-- Name: commission commission_cohortId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commission
    ADD CONSTRAINT "commission_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES public.cohort(id) ON DELETE CASCADE;


--
-- Name: content content_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT "content_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public.topics(id) ON DELETE CASCADE;


--
-- Name: contents contents_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public.content(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey1" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey2" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey3" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey4" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: hintFragment hintFragment_typeId_fkey5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hintFragment"
    ADD CONSTRAINT "hintFragment_typeId_fkey5" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: modules modules_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public.content(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey1" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey2" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey3" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey4" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: multipleChoiceFragment multipleChoiceFragment_typeId_fkey5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."multipleChoiceFragment"
    ADD CONSTRAINT "multipleChoiceFragment_typeId_fkey5" FOREIGN KEY ("typeId") REFERENCES public."fragmentType"(id) ON DELETE CASCADE;


--
-- Name: payment payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: textFragment textFragment_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."textFragment"
    ADD CONSTRAINT "textFragment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public.content(id) ON DELETE CASCADE;


--
-- Name: topics topics_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT "topics_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.pledumodules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_commission user_commission_CommissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commission
    ADD CONSTRAINT "user_commission_CommissionId_fkey" FOREIGN KEY ("CommissionId") REFERENCES public.commission(id) ON DELETE CASCADE;


--
-- Name: user_commission user_commission_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commission
    ADD CONSTRAINT "user_commission_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_commission user_commission_UserId_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commission
    ADD CONSTRAINT "user_commission_UserId_fkey1" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_commissions user_commissions_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_commissions
    ADD CONSTRAINT "user_commissions_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_content user_content_ContentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_content
    ADD CONSTRAINT "user_content_ContentId_fkey" FOREIGN KEY ("ContentId") REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_content user_content_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_content
    ADD CONSTRAINT "user_content_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_module user_module_ModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module
    ADD CONSTRAINT "user_module_ModuleId_fkey" FOREIGN KEY ("ModuleId") REFERENCES public.pledumodules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_module user_module_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module
    ADD CONSTRAINT "user_module_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_topic user_topic_TopicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_topic
    ADD CONSTRAINT "user_topic_TopicId_fkey" FOREIGN KEY ("TopicId") REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_topic user_topic_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_topic
    ADD CONSTRAINT "user_topic_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

