BEGIN;

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

CREATE TYPE public.provider AS ENUM ('github', 'gitlab', 'bitbucket');

CREATE TABLE public.user_providers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (provider_type, provider_id),
  UNIQUE (user_id, provider_type),
  UNIQUE (refresh_token)
);

CREATE TABLE public.orgs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  github_installation_id INT NULL,
  UNIQUE (provider_type, provider_id),
  UNIQUE (github_installation_id)
);

CREATE TABLE public.repos (
  id SERIAL PRIMARY KEY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (org_id, provider_id)
);

COMMIT;
