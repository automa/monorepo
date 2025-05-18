FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache bash

RUN npm install -g pnpm

# Copy rarely changing files first
COPY tsconfig.json ./
COPY packages/prisma/tsconfig.json ./packages/prisma/
COPY packages/common/tsconfig.json ./packages/common/
COPY packages/config/tsconfig.json ./packages/config/
COPY packages/api/tsconfig.json ./packages/api/

# Copy package.json files & schema.prisma
COPY packages/prisma/package.json packages/prisma/schema.prisma ./packages/prisma/
COPY packages/common/package.json ./packages/common/
COPY packages/config/package.json ./packages/config/
COPY packages/api/package.json ./packages/api/
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build server
COPY packages/prisma/src ./packages/prisma/src
COPY packages/common/src ./packages/common/src
COPY packages/config/src ./packages/config/src
COPY packages/config/schemas ./packages/config/schemas
COPY packages/api/src ./packages/api/src

RUN pnpm --filter @automa/api build
RUN pnpm --filter @automa/api copy-graphql

# Install production dependencies
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
RUN pnpm --filter @automa/prisma prisma-generate

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache git

COPY --from=builder /bin/bash /bin/bash

COPY --from=builder /app/packages/api/build ./packages/api/build
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json

COPY --from=builder /app/packages/config/schemas ./packages/config/schemas
COPY --from=builder /app/packages/config/build ./packages/config/build
COPY --from=builder /app/packages/config/package.json ./packages/config/package.json

COPY --from=builder /app/packages/common/build ./packages/common/build
COPY --from=builder /app/packages/common/package.json ./packages/common/package.json

COPY --from=builder /app/packages/prisma/build ./packages/prisma/build
COPY --from=builder /app/packages/prisma/package.json ./packages/prisma/package.json

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=builder /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=builder /app/packages/common/node_modules ./packages/common/node_modules
COPY --from=builder /app/packages/prisma/node_modules ./packages/prisma/node_modules

CMD ["node", "packages/api/build/index.js"]
