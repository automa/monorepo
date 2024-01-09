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
  refresh_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (provider_type, provider_id),
  UNIQUE (user_id, provider_type)
);

CREATE TABLE public.orgs (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  github_installation_id INT,
  UNIQUE (provider_type, provider_id),
  UNIQUE (github_installation_id)
);

INSERT INTO public.orgs (name, provider_type, provider_id)
VALUES ('automa', 'github', '65730741');

CREATE TABLE public.repos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_commit_synced VARCHAR(40),
  UNIQUE (org_id, provider_id)
);

CREATE TYPE public.competitors AS ENUM ('dependabot', 'renovate');

CREATE TABLE public.repo_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id INTEGER NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
  cause INTEGER NOT NULL,
  commit VARCHAR(40) NOT NULL,
  settings JSONB,
  validation_errors JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  imported_from public.competitors
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

CREATE TYPE public.bot_type AS ENUM ('scheduled', 'push');

CREATE TABLE public.bots (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type public.bot_type NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, name)
);

INSERT INTO public.bots (org_id, name, type)
VALUES
  (1, 'automa', 'push'),
  (1, 'dependency', 'scheduled');

CREATE TYPE public.project_provider AS ENUM ('github', 'linear');

CREATE TABLE public.org_project_providers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  provider_type public.project_provider NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  created_by INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, provider_type, name)
);

COMMIT;
