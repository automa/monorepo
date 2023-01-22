BEGIN;

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE public.provider AS ENUM ('github', 'gitlab', 'bitbucket');

CREATE TABLE public.orgs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  github_installation_id INT NULL
);

CREATE TABLE public.repos (
  id SERIAL PRIMARY KEY,
  org_id INTEGER NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  provider_type public.provider NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMIT;
