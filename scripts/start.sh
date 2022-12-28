#!/bin/bash

bash ./scripts/start-deps.sh

yarn run pm2 start scripts/ecosystem.config.js
