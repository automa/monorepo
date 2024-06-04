import { join } from 'node:path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import inheritDirective from 'graphql-inherits';

const typeDefs = loadFilesSync(join(__dirname, 'schema/*.graphql'));

let schema = makeExecutableSchema({
  typeDefs,
});

schema = inheritDirective(schema, 'inherits');

export default schema;
