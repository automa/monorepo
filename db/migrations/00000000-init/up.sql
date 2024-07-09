BEGIN;

CREATE EXTENSION citext;
CREATE EXTENSION pg_jsonschema;
CREATE EXTENSION "uuid-ossp";

CREATE TABLE public.users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email citext NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

CREATE TYPE public.provider AS ENUM ('github', 'gitlab');

CREATE TABLE public.user_providers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email citext NOT NULL,
  refresh_token VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (provider_type, provider_id),
  UNIQUE (user_id, provider_type)
);

CREATE TABLE public.orgs (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name citext NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  github_installation_id INT,
  UNIQUE (name),
  UNIQUE (provider_type, provider_id),
  UNIQUE (github_installation_id)
);

INSERT INTO public.orgs (name, provider_type, provider_id, provider_name)
VALUES ('automa', 'github', '65730741', 'automa');

CREATE TABLE public.repos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name citext NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_commit_synced VARCHAR(40),
  UNIQUE (org_id, provider_id)
);

CREATE TABLE public.repo_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id INTEGER NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
  cause INTEGER NOT NULL,
  commit VARCHAR(40) NOT NULL,
  settings JSONB,
  validation_errors JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX repo_settings_repo_id_created_at_idx
ON public.repo_settings (repo_id, created_at DESC);

CREATE TABLE public.user_orgs (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE public.user_repos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  repo_id INTEGER NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, repo_id)
);

CREATE TYPE public.bot AS ENUM ('event', 'scheduled');

CREATE TABLE public.bots (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name citext NOT NULL,
  type public.bot NOT NULL,
  webhook_url VARCHAR(255) NOT NULL,
  -- TODO: webhook_secret (here, check and data below)
  -- TODO: webhook_verification / client_secret
  short_description VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  description TEXT,
  homepage VARCHAR(255),
  published_at TIMESTAMP,
  is_published BOOLEAN GENERATED ALWAYS AS (published_at IS NOT NULL) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_preview BOOLEAN NOT NULL DEFAULT FALSE,
  is_deterministic BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (org_id, name),
  CHECK (published_at IS NULL OR (
    published_at IS NOT NULL AND
    description IS NOT NULL AND
    homepage IS NOT NULL
  ))
);

CREATE INDEX bots_is_published_idx
ON public.bots (is_published);

INSERT INTO public.bots (org_id, name, type, webhook_url, short_description, homepage, is_preview, is_deterministic)
VALUES
  (1, 'automa', 'event', 'https://api.automa.app/hooks/automa', 'Updates & migrates automa settings', 'https://automa.app', FALSE, TRUE),
  (1, 'dependency', 'event', 'https://api.dependency.bot/hooks/automa', 'Upgrade dependencies by updating code', 'https://dependency.bot', TRUE, TRUE),
  (1, 'refactor', 'event', 'https://api.refactor.bot/hooks/automa', 'Refactors your code according to your rules', 'https://refactor.bot', TRUE, TRUE);

CREATE TABLE public.bot_installations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bot_id INTEGER NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (bot_id, org_id)
);

CREATE TYPE public.integration AS ENUM ('github', 'linear', 'slack', 'jira');

CREATE TABLE public.integrations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  integration_type public.integration NOT NULL,
  secrets JSONB NOT NULL DEFAULT '{}',
  config JSONB NOT NULL DEFAULT '{}',
  created_by INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, integration_type)
);

CREATE TABLE public.tasks (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  is_completed BOOLEAN GENERATED ALWAYS AS (completed_at IS NOT NULL) STORED
);

CREATE INDEX tasks_org_id_created_at_idx
ON public.tasks (org_id, created_at DESC);

CREATE TYPE public.task_item AS ENUM ('message', 'origin', 'pull_request', 'repo', 'bot');

CREATE TABLE public.task_items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id INTEGER NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  type public.task_item NOT NULL,
  data JSONB NOT NULL,
  actor_user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX task_items_task_id_created_at_idx
ON public.task_items (task_id, created_at ASC);

COMMIT;
