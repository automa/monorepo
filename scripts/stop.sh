#!/bin/bash

yarn run pm2 kill

bash ./scripts/stop-deps.sh
