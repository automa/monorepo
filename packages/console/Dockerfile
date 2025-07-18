FROM node:22-alpine AS builder

ENV NODE_ENV=production

ENV VITE_API_URI=__API_URI__
ENV VITE_GRAPHQL_URI=__GRAPHQL_URI__

WORKDIR /app

RUN npm install -g pnpm

# Copy rarely changing files first
COPY tsconfig.json ./
COPY packages/prisma/tsconfig.json ./packages/prisma/
COPY packages/common/tsconfig.json ./packages/common/
COPY packages/console/tsconfig.json ./packages/console/

# Copy package.json files & schema.prisma
COPY packages/prisma/package.json packages/prisma/schema.prisma ./packages/prisma/
COPY packages/common/package.json ./packages/common/
COPY packages/console/package.json ./packages/console/
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build client
COPY packages/common/src ./packages/common/src
COPY packages/console/src ./packages/console/src
COPY packages/console/public ./packages/console/public
COPY packages/console/index.html packages/console/postcss.config.js packages/console/vite.config.mts packages/console/tailwind.config.ts ./packages/console/
COPY packages/console/nginx.conf ./packages/console/

RUN pnpm --filter @automa/common build
RUN pnpm --filter @automa/console build

FROM nginx:1.28-alpine AS runner

LABEL org.opencontainers.image.title="Automa Console"
LABEL org.opencontainers.image.description="Console service for Automa"

ENV API_URI=

COPY --from=builder /app/packages/console/build /usr/share/nginx/html
COPY --from=builder /app/packages/console/nginx.conf /etc/nginx/conf.d/default.conf

RUN echo '#!/bin/sh' > /docker-entrypoint.d/30-envsubst.sh \
    && echo 'find /usr/share/nginx/html -name "*.js" -exec sed -i "s|__API_URI__|${API_URI}|g" {} \;' >> /docker-entrypoint.d/30-envsubst.sh \
    && echo 'find /usr/share/nginx/html -name "*.js" -exec sed -i "s|__GRAPHQL_URI__|${API_URI}/graphql|g" {} \;' >> /docker-entrypoint.d/30-envsubst.sh

RUN chmod +x /docker-entrypoint.d/30-envsubst.sh
