#!/bin/bash

bash ./scripts/start-deps.sh

pnpm pm2 start scripts/${1:-local}.config.js
