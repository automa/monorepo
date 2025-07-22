# How to Contribute

Thank you for your interest in contributing to this project! Below are some guidelines to help you get started.

## Legal Boilerplate

We require contributors to agree to a legal boilerplate before their contributions can be accepted (also known as Contributor License Agreement or CLA). This is to ensure that we have the freedom to change the license of the project in the future to a more permissive one ([Open Source](https://opensource.org/)).

While we do agree that [CLAs are not fair](https://ben.balter.com/2018/01/02/why-you-probably-shouldnt-add-a-cla-to-your-open-source-project/) to contributors, we believe that this is the only way to ensure that we can change the license in the future.

## Structure of the monorepo

- `packages/api`: Backend API server
- `packages/console`: Frontend application
- `packages/marketing`: Marketing website
- `packages/common`: Shared utilities and types between Backend and Frontend

## Prerequisites

- Have [`git`](https://git-scm.com/) installed.
- Have [`docker`](https://docker.com/) installed.
- Have [`node`](https://nodejs.org/) & [`pnpm`](https://pnpm.io/) installed.

## Installing dependencies

```sh
pnpm install
```

This will also set up Git hooks (Husky + lint-staged) automatically.

## Setup environment variables

`packages/api` includes an encrypted `.env` file that can be decrypted by a maintainer.

If you are not a maintainer, you will need to create your own `.env.local` file in `packages/api` with the `GITHUB_APP_*` variables set.

> **NOTE**: You can immediately start everything without the `.env.local` file, since we have a guided setup for the first time you run the application.

## Starting development

Starts all dependencies (using `docker`) & services (using `pm2`) in development (including watch) mode:

```sh
pnpm start
```

This command will:

- Start the database (PostgreSQL) on port `5432` with a default user `automa` and database `automa`
- Start the cache (Redis) on port `6379`
- Start the `api` server on port `8080`
- Start the `console` application on port `3000`
- Start the `marketing` website on port `4000`

You can restart individual service if needed:

```sh
npx pm2 restart api
```

## Database changes

If you have made changes to the database schema, you would need to update `prisma` schema and types.

```sh
pnpm prisma-refresh
```

## Stopping development

```sh
pnpm stop
```

## CI/CD

#### Testing

```sh
pnpm start-deps

# API tests
cd packages/api && pnpm test

# Console tests
cd packages/console && pnpm test
```

#### Linting

```sh
pnpm graphql-generate
pnpm lint
```

#### Formatting

```sh
pnpm format
```

## GraphQL & code generation

- `packages/api` defines the GraphQL schema under `packages/api/src/graphql/schema`.
- `packages/console` contains GraphQL operations in `*.queries.ts` files.
- After modifying operations or schema, if you have development mode running, everything will be automatically regenerated.
- If you need to manually regenerate the GraphQL schema and types, run:

```sh
pnpm graphql-generate
```

This regenerates schema in `schema.graphql`, shared types in `packages/common/src/graphql.ts`, and client types in `packages/console/src/gql`.
