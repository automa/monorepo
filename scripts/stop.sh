#!/bin/bash

pnpm pm2 kill

bash ./scripts/stop-deps.sh
