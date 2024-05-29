BEGIN;

DROP TABLE public.task_items;
DROP TABLE public.tasks;
DROP TABLE public.integrations;
DROP TABLE public.bot_installation_repositories;
DROP TABLE public.bot_installations;
DROP TABLE public.bots;
DROP TABLE public.user_repos;
DROP TABLE public.user_orgs;
DROP TABLE public.repo_settings;
DROP TABLE public.repos;
DROP TABLE public.orgs;
DROP TABLE public.user_providers;
DROP TABLE public.users;

DROP TYPE public.integration;
DROP TYPE public.bot;
DROP TYPE public.provider;

DROP EXTENSION citext;
DROP EXTENSION pg_jsonschema;
DROP EXTENSION "uuid-ossp";

COMMIT;
