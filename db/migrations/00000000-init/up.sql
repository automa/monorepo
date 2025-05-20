BEGIN;

CREATE EXTENSION citext;
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
  UNIQUE (user_id, provider_type),
  UNIQUE (provider_type, provider_id)
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

CREATE TYPE public.bot AS ENUM ('manual', 'scheduled');

CREATE TABLE public.bots (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name citext NOT NULL,
  type public.bot NOT NULL,
  webhook_url VARCHAR(255) NOT NULL,
  webhook_secret VARCHAR(255) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  draft_paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  image_url VARCHAR(255),
  description JSONB,
  homepage VARCHAR(255),
  published_at TIMESTAMP,
  is_published BOOLEAN GENERATED ALWAYS AS (published_at IS NOT NULL) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_preview BOOLEAN NOT NULL DEFAULT FALSE,
  is_deterministic BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (org_id, name)
);

CREATE INDEX bots_is_published_idx
ON public.bots (is_published);

CREATE INDEX bots_type_idx
ON public.bots (type);

CREATE TABLE public.bot_installations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bot_id INTEGER NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (bot_id, org_id)
);

CREATE INDEX bot_installations_org_id_created_at_idx
ON public.bot_installations (org_id, created_at ASC);

CREATE TYPE public.integration AS ENUM ('github', 'linear', 'slack', 'jira');

CREATE TABLE public.integrations (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  type public.integration NOT NULL,
  secrets JSONB NOT NULL DEFAULT '{}',
  config JSONB NOT NULL DEFAULT '{}',
  created_by INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, type)
);

CREATE TYPE public.task_state AS ENUM ('started', 'skipped', 'submitted', 'completed', 'cancelled', 'failed');

CREATE TABLE public.tasks (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
  state public.task_state NOT NULL DEFAULT 'started',
  token VARCHAR(255) NOT NULL,
  proposal_token VARCHAR(255),
  proposal_base_commit VARCHAR(40),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX tasks_org_id_created_at_idx
ON public.tasks (org_id, created_at DESC);

CREATE TYPE public.task_activity AS ENUM ('state');

CREATE TABLE public.task_activities (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type public.task_activity NOT NULL,
  from_state public.task_state,
  to_state public.task_state,
  CONSTRAINT state_activity CHECK (type <> 'state' OR (from_state IS NOT NULL AND to_state IS NOT NULL))
);

CREATE TYPE public.task_item AS ENUM ('message', 'origin', 'repo', 'bot', 'proposal', 'activity');

CREATE TABLE public.task_items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id INTEGER NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  type public.task_item NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  actor_user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  repo_id INTEGER REFERENCES public.repos(id) ON DELETE SET NULL,
  bot_id INTEGER REFERENCES public.bots(id) ON DELETE SET NULL,
  task_activity_id INTEGER REFERENCES public.task_activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT repo_item CHECK (type <> 'repo' OR repo_id IS NOT NULL),
  CONSTRAINT bot_item CHECK (type <> 'bot' OR bot_id IS NOT NULL),
  CONSTRAINT proposal_item CHECK (type <> 'proposal' OR (repo_id IS NOT NULL AND bot_id IS NOT NULL)),
  CONSTRAINT activity_item CHECK (type <> 'activity' OR task_activity_id IS NOT NULL)
);

CREATE INDEX task_items_task_id_created_at_idx
ON public.task_items (task_id, created_at ASC);

COMMIT;
