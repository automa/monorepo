import { join } from 'node:path';

import { loadFilesSync } from '@graphql-tools/load-files';
import {
  ResolversComposition,
  composeResolvers,
} from '@graphql-tools/resolvers-composition';
import { makeExecutableSchema } from '@graphql-tools/schema';
import inheritDirective from 'graphql-inherits';
import { GraphQLError } from 'graphql';

const typeDefs = loadFilesSync(join(__dirname, 'schema/*.graphql'));
const resolvers = loadFilesSync(join(__dirname, 'resolvers/*.{js,ts}'));

const isAuthenticated: ResolversComposition =
  (next) => async (root, args, context, info) => {
    if (!context.user) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 200 },
        },
      });
    }

    return next(root, args, context, info);
  };

const composedResolvers = resolvers.map((resolver) =>
  composeResolvers(resolver, {
    '!PublicBot.!publicBots': [isAuthenticated],
  }),
);

let schema = makeExecutableSchema({
  typeDefs,
  resolvers: composedResolvers,
});

schema = inheritDirective(schema, 'inherits');

export default schema;
