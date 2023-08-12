BEGIN;

DROP TABLE public.user_repos;
DROP TABLE public.user_orgs;
DROP TABLE public.repos;
DROP TABLE public.orgs;
DROP TABLE public.user_providers;

DROP TYPE public.provider;

DROP TABLE public.users;

DROP EXTENSION citext;
DROP EXTENSION "pg_jsonschema";

COMMIT;
