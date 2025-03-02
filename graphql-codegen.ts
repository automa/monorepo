import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  documents: 'src/**/*.queries.ts',
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: { unmaskFunctionName: 'getFragment' },
      },
    },
    'src/gql/possibleTypes.json': {
      plugins: ['fragment-matcher'],
    },
  },
};

export default config;
