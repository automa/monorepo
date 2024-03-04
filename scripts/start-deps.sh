#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans

pnpm --filter @automa/common build
pnpm --filter @automa/config build
pnpm --filter @automa/prisma build

psql -U automa -h localhost -w automa -f db/migrations/00000000-init/up.sql
