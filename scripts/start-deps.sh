#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans

pnpm --filter @automa/api build

psql -U automa -h localhost -w automa -f db/migrations/00000000-init/up.sql

if [ "$SEED" = true ]; then
	psql -U automa -h localhost -w automa -f db/migrations/00000000-init/seed.sql
fi
