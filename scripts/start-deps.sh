#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans

pnpm --filter @automa/api build

export DATABASE_URL=postgresql://automa@localhost:5432/automa
export SCHEMA_FILE=db/schema.sql

if [ "$SEED" = true ]; then
	pnpm db-migrate --seed
else
	pnpm db-migrate
fi
