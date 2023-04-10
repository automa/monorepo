BEGIN;

CREATE EXTENSION "pg_jsonschema";
CREATE EXTENSION "ulid";

CREATE TABLE public.users (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  UNIQUE (email)
);

CREATE TYPE public.provider AS ENUM ('github', 'gitlab', 'bitbucket');

CREATE TABLE public.user_providers (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  user_id ulid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  UNIQUE (provider_type, provider_id),
  UNIQUE (user_id, provider_type),
  UNIQUE (refresh_token)
);

CREATE TABLE public.orgs (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  github_installation_id INT NULL,
  UNIQUE (provider_type, provider_id),
  UNIQUE (github_installation_id)
);

CREATE TABLE public.repos (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  org_id ulid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  has_installation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  UNIQUE (org_id, provider_id)
);

CREATE TABLE public.user_orgs (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  user_id ulid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id ulid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  UNIQUE (user_id, org_id)
);

CREATE TABLE public.user_repos (
  id ulid NOT NULL DEFAULT gen_ulid() PRIMARY KEY,
  user_id ulid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  repo_id ulid NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL GENERATED ALWAYS AS (id::TIMESTAMP) STORED,
  UNIQUE (user_id, repo_id)
);

COMMIT;
