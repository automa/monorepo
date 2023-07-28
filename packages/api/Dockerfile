FROM node:18-alpine AS builder

WORKDIR /app

# Copy rarely changing files first
COPY tsconfig.json generate-graphql.ts ./
COPY packages/prisma/tsconfig.json ./packages/prisma/
COPY packages/common/tsconfig.json ./packages/common/
COPY packages/api/tsconfig.json ./packages/api/

# Copy package.json files & schema.prisma
COPY packages/prisma/package.json packages/prisma/schema.prisma ./packages/prisma/
COPY packages/common/package.json ./packages/common/
COPY packages/api/package.json ./packages/api/
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Build grahql schema
COPY packages/api/src/graphql/schema ./packages/api/src/graphql/schema
RUN yarn workspace @automa/api copy-graphql
RUN yarn generate-graphql

# Build server
COPY packages/prisma/src ./packages/prisma/src
COPY packages/common/src ./packages/common/src
COPY packages/api/src ./packages/api/src

RUN yarn workspace @automa/prisma build
RUN yarn workspace @automa/common build
RUN yarn workspace @automa/api build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

COPY --from=builder /app/packages/api/build ./packages/api/build
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json

COPY --from=builder /app/packages/common/build ./packages/common/build
COPY --from=builder /app/packages/common/package.json ./packages/common/package.json

COPY --from=builder /app/packages/prisma/build ./packages/prisma/build
COPY --from=builder /app/packages/prisma/package.json ./packages/prisma/package.json

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/api/build/index.js"]
