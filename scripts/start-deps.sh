#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans

pnpm --filter @automa/api build

psql -h localhost -U automa -w automa -f db/migrations/00000000-init/up.sql

if [ "$SEED" = true ]; then
	psql -h localhost -U automa  -w automa -f db/migrations/00000000-init/seed.sql
fi
