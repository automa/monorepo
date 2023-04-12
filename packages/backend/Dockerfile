FROM node:16-alpine as builder

WORKDIR /app

# Copy rarely changing files first
COPY tsconfig.json generate-graphql.ts ./
COPY packages/prisma/tsconfig.json ./packages/prisma/
COPY packages/common/tsconfig.json ./packages/common/
COPY packages/backend/tsconfig.json ./packages/backend/

# Copy package.json files & schema.prisma
COPY packages/prisma/package.json packages/prisma/schema.prisma ./packages/prisma/
COPY packages/common/package.json ./packages/common/
COPY packages/backend/package.json ./packages/backend/
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

COPY packages/backend/src/graphql/schema ./packages/backend/src/graphql/schema
RUN yarn workspace @automa/backend copy-graphql
RUN yarn generate-graphql

COPY packages/prisma/.env ./packages/prisma/
COPY packages/prisma/src ./packages/prisma/src
COPY packages/common/src ./packages/common/src
COPY packages/backend/src ./packages/backend/src

RUN yarn workspace @automa/prisma build
RUN yarn workspace @automa/common build
RUN yarn workspace @automa/backend build

FROM node:16-alpine as runner

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

COPY --from=builder /app/packages/backend/build ./packages/backend/build
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json

COPY --from=builder /app/packages/common/build ./packages/common/build
COPY --from=builder /app/packages/common/package.json ./packages/common/package.json

COPY --from=builder /app/packages/prisma/build ./packages/prisma/build
COPY --from=builder /app/packages/prisma/package.json ./packages/prisma/package.json
COPY --from=builder /app/packages/prisma/.env ./packages/prisma/.env

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/backend/build/index.js"]
