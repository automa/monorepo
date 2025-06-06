## Structure of the monorepo

- `packages/api` - API service
- `packages/console` - Frontend application
- `packages/marketing` - Marketing website
- `packages/common` - Common stuff between `api` & `console`

## Linting & Formatting

- We use `pnpm lint` in the root for linting
- We use `pnpm format` in the root for formatting

## GraphQL

- `console` has GraphQL operations defined in `*.queries.ts` files
- `api` has GraphQL schema defined in `packages/api/src/graphql/schema` folder
- Whenever any of them change, we use `pnpm graphql-generate` in root to generate some code
