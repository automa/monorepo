#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans --build

pnpm --filter @automa/api build

export DATABASE_URL=postgresql://automa@localhost:5432/automa
export SCHEMA_FILE=db/schema.sql

pnpm db-migrate

# TODO: Remove after unifying under dev env packager
# Remove the line in schema.sql starting with `-- Dumped by pg_dump version`
sed -i '/^-- Dumped by pg_dump version/d' $SCHEMA_FILE
