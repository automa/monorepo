--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-2.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: crude; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA crude;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: bot; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bot AS ENUM (
    'manual',
    'scheduled'
);


--
-- Name: integration; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.integration AS ENUM (
    'github',
    'linear',
    'slack',
    'jira'
);


--
-- Name: provider; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.provider AS ENUM (
    'github',
    'gitlab'
);


--
-- Name: task_activity; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_activity AS ENUM (
    'state'
);


--
-- Name: task_item; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_item AS ENUM (
    'message',
    'origin',
    'repo',
    'bot',
    'proposal',
    'activity'
);


--
-- Name: task_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_state AS ENUM (
    'started',
    'skipped',
    'submitted',
    'completed',
    'cancelled',
    'failed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: migrations; Type: TABLE; Schema: crude; Owner: -
--

CREATE TABLE crude.migrations (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    name character varying(255) NOT NULL,
    hash character varying(255) NOT NULL,
    down_sql text
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: crude; Owner: -
--

ALTER TABLE crude.migrations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME crude.migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bot_installations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bot_installations (
    id integer NOT NULL,
    bot_id integer NOT NULL,
    org_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: bot_installations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bot_installations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bot_installations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bots (
    id integer NOT NULL,
    org_id integer NOT NULL,
    name public.citext NOT NULL,
    type public.bot NOT NULL,
    webhook_url character varying(255) NOT NULL,
    webhook_secret character varying(255) NOT NULL,
    short_description character varying(255) NOT NULL,
    draft_paths text[] DEFAULT ARRAY[]::text[] NOT NULL,
    paths text[] DEFAULT ARRAY[]::text[] NOT NULL,
    image_url character varying(255),
    description jsonb,
    homepage character varying(255),
    published_at timestamp without time zone,
    is_published boolean GENERATED ALWAYS AS ((published_at IS NOT NULL)) STORED,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    is_preview boolean DEFAULT false NOT NULL,
    is_deterministic boolean DEFAULT false NOT NULL,
    is_sponsored boolean DEFAULT false NOT NULL,
    self_hostable_repo public.citext,
    is_self_hostable boolean GENERATED ALWAYS AS ((self_hostable_repo IS NOT NULL)) STORED
);


--
-- Name: bots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integrations (
    id integer NOT NULL,
    org_id integer NOT NULL,
    type public.integration NOT NULL,
    secrets jsonb DEFAULT '{}'::jsonb NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.integrations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.integrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orgs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orgs (
    id integer NOT NULL,
    name public.citext NOT NULL,
    provider_type public.provider NOT NULL,
    provider_id character varying(255) NOT NULL,
    provider_name character varying(255) NOT NULL,
    is_user boolean DEFAULT false NOT NULL,
    has_installation boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    github_installation_id integer
);


--
-- Name: orgs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.orgs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.orgs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: repo_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repo_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    repo_id integer NOT NULL,
    cause integer NOT NULL,
    commit character varying(40) NOT NULL,
    settings jsonb,
    validation_errors jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: repos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repos (
    id integer NOT NULL,
    org_id integer NOT NULL,
    name public.citext NOT NULL,
    provider_id character varying(255) NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    has_installation boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_commit_synced character varying(40)
);


--
-- Name: repos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.repos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: task_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_activities (
    id integer NOT NULL,
    type public.task_activity NOT NULL,
    from_state public.task_state,
    to_state public.task_state,
    CONSTRAINT state_activity CHECK (((type <> 'state'::public.task_activity) OR ((from_state IS NOT NULL) AND (to_state IS NOT NULL))))
);


--
-- Name: task_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.task_activities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.task_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: task_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_items (
    id integer NOT NULL,
    task_id integer NOT NULL,
    type public.task_item NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    actor_user_id integer,
    repo_id integer,
    bot_id integer,
    task_activity_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT activity_item CHECK (((type <> 'activity'::public.task_item) OR (task_activity_id IS NOT NULL))),
    CONSTRAINT bot_item CHECK (((type <> 'bot'::public.task_item) OR (bot_id IS NOT NULL))),
    CONSTRAINT proposal_item CHECK (((type <> 'proposal'::public.task_item) OR ((repo_id IS NOT NULL) AND (bot_id IS NOT NULL)))),
    CONSTRAINT repo_item CHECK (((type <> 'repo'::public.task_item) OR (repo_id IS NOT NULL)))
);


--
-- Name: task_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.task_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.task_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    org_id integer NOT NULL,
    title character varying(255) NOT NULL,
    is_scheduled boolean DEFAULT false NOT NULL,
    state public.task_state DEFAULT 'started'::public.task_state NOT NULL,
    token character varying(255) NOT NULL,
    proposal_token character varying(255),
    proposal_base_commit character varying(40),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    cost_in_cents integer
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tasks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_orgs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_orgs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    org_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_orgs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_orgs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_orgs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_providers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    provider_type public.provider NOT NULL,
    provider_id character varying(255) NOT NULL,
    provider_email public.citext NOT NULL,
    refresh_token character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_providers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_providers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_repos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_repos (
    id integer NOT NULL,
    user_id integer NOT NULL,
    repo_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_repos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_repos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_repos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email public.citext NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: crude; Owner: -
--

ALTER TABLE ONLY crude.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: crude; Owner: -
--

ALTER TABLE ONLY crude.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: bot_installations bot_installations_bot_id_org_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bot_installations
    ADD CONSTRAINT bot_installations_bot_id_org_id_key UNIQUE (bot_id, org_id);


--
-- Name: bot_installations bot_installations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bot_installations
    ADD CONSTRAINT bot_installations_pkey PRIMARY KEY (id);


--
-- Name: bots bots_org_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_org_id_name_key UNIQUE (org_id, name);


--
-- Name: bots bots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_pkey PRIMARY KEY (id);


--
-- Name: integrations integrations_org_id_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_org_id_type_key UNIQUE (org_id, type);


--
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- Name: orgs orgs_github_installation_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_github_installation_id_key UNIQUE (github_installation_id);


--
-- Name: orgs orgs_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_name_key UNIQUE (name);


--
-- Name: orgs orgs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_pkey PRIMARY KEY (id);


--
-- Name: orgs orgs_provider_type_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_provider_type_provider_id_key UNIQUE (provider_type, provider_id);


--
-- Name: repo_settings repo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repo_settings
    ADD CONSTRAINT repo_settings_pkey PRIMARY KEY (id);


--
-- Name: repos repos_org_id_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repos
    ADD CONSTRAINT repos_org_id_provider_id_key UNIQUE (org_id, provider_id);


--
-- Name: repos repos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repos
    ADD CONSTRAINT repos_pkey PRIMARY KEY (id);


--
-- Name: task_activities task_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_pkey PRIMARY KEY (id);


--
-- Name: task_items task_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: user_orgs user_orgs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_orgs
    ADD CONSTRAINT user_orgs_pkey PRIMARY KEY (id);


--
-- Name: user_orgs user_orgs_user_id_org_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_orgs
    ADD CONSTRAINT user_orgs_user_id_org_id_key UNIQUE (user_id, org_id);


--
-- Name: user_providers user_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_providers
    ADD CONSTRAINT user_providers_pkey PRIMARY KEY (id);


--
-- Name: user_providers user_providers_provider_type_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_providers
    ADD CONSTRAINT user_providers_provider_type_provider_id_key UNIQUE (provider_type, provider_id);


--
-- Name: user_providers user_providers_user_id_provider_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_providers
    ADD CONSTRAINT user_providers_user_id_provider_type_key UNIQUE (user_id, provider_type);


--
-- Name: user_repos user_repos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_repos
    ADD CONSTRAINT user_repos_pkey PRIMARY KEY (id);


--
-- Name: user_repos user_repos_user_id_repo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_repos
    ADD CONSTRAINT user_repos_user_id_repo_id_key UNIQUE (user_id, repo_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bot_installations_org_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bot_installations_org_id_created_at_idx ON public.bot_installations USING btree (org_id, created_at);


--
-- Name: bots_is_published_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bots_is_published_idx ON public.bots USING btree (is_published);


--
-- Name: bots_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bots_type_idx ON public.bots USING btree (type);


--
-- Name: repo_settings_repo_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX repo_settings_repo_id_created_at_idx ON public.repo_settings USING btree (repo_id, created_at DESC);


--
-- Name: task_items_task_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_items_task_id_created_at_idx ON public.task_items USING btree (task_id, created_at);


--
-- Name: tasks_org_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tasks_org_id_created_at_idx ON public.tasks USING btree (org_id, created_at DESC);


--
-- Name: bot_installations bot_installations_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bot_installations
    ADD CONSTRAINT bot_installations_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.bots(id) ON DELETE CASCADE;


--
-- Name: bot_installations bot_installations_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bot_installations
    ADD CONSTRAINT bot_installations_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: bots bots_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: integrations integrations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: integrations integrations_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: repo_settings repo_settings_repo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repo_settings
    ADD CONSTRAINT repo_settings_repo_id_fkey FOREIGN KEY (repo_id) REFERENCES public.repos(id) ON DELETE CASCADE;


--
-- Name: repos repos_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repos
    ADD CONSTRAINT repos_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: task_items task_items_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: task_items task_items_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.bots(id) ON DELETE SET NULL;


--
-- Name: task_items task_items_repo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_repo_id_fkey FOREIGN KEY (repo_id) REFERENCES public.repos(id) ON DELETE SET NULL;


--
-- Name: task_items task_items_task_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_task_activity_id_fkey FOREIGN KEY (task_activity_id) REFERENCES public.task_activities(id) ON DELETE CASCADE;


--
-- Name: task_items task_items_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_items
    ADD CONSTRAINT task_items_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: user_orgs user_orgs_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_orgs
    ADD CONSTRAINT user_orgs_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: user_orgs user_orgs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_orgs
    ADD CONSTRAINT user_orgs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_providers user_providers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_providers
    ADD CONSTRAINT user_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_repos user_repos_repo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_repos
    ADD CONSTRAINT user_repos_repo_id_fkey FOREIGN KEY (repo_id) REFERENCES public.repos(id) ON DELETE CASCADE;


--
-- Name: user_repos user_repos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_repos
    ADD CONSTRAINT user_repos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

