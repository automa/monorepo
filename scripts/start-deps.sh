#!/bin/bash

docker compose -f scripts/docker-compose.yml up -d --remove-orphans

yarn workspace @automa/common build
yarn workspace @automa/prisma build

psql -U automa -W automa -h localhost -f db/migrations/00000000-init/up.sql
