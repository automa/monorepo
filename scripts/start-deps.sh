#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans --build

pnpm --filter @automa/api build

pnpm db-dev up

# TODO: Remove after unifying under dev env packager
pnpm db-dump-fix
