#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans --build

pnpm --filter @automa/api build

pnpm db-dev up
