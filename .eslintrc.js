const product = 'automa';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:mocha/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^\u0000'],
          ['^node:'],
          [
            '^(fastify)$',
            '^(chai|quibble|sinon)$',
            '^(@prisma/client|fastify-.*|@fastify/.*)(/.*)?$',
            '^(@opentelemetry/(sdk-node|semantic-conventions))$',
            '^@?\\w',
          ],
          [`^@${product}/`],
          ['^'],
          ['^.*/(env|telemetry)$'],
          ['^\\.\\./(types|utils)$'],
          ['^\\.\\.'],
          ['^\\./(types|utils)$'],
          ['^\\.'],
        ],
      },
    ],
    'import/no-empty-named-blocks': 'error',
    'import/no-absolute-path': 'error',
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-exclusive-tests': 'error',
  },
  env: {
    node: true,
    mocha: true,
  },
  ignorePatterns: [
    '!.lintstagedrc.js',
    '!.prettierrc.js',
    'build',
    'coverage',
    'schema.graphql',
    'packages/common/src/graphql.ts',
  ],
  overrides: [
    {
      files: ['**/*.graphql'],
      extends: ['plugin:@graphql-eslint/schema-recommended'],
      rules: {
        '@graphql-eslint/naming-convention': [
          'error',
          {
            types: 'PascalCase',
            InputValueDefinition: 'snake_case',
            Argument: 'snake_case',
            DirectiveDefinition: 'camelCase',
            EnumValueDefinition: 'snake_case',
            'FieldDefinition[parent.name.value!=Query][parent.name.value!=Mutation][parent.name.value!=Subscription]':
              {
                style: 'snake_case',
              },
            'FieldDefinition[parent.name.value=Query]': {
              style: 'camelCase',
              forbiddenPrefixes: ['query', 'get'],
              forbiddenSuffixes: ['Query'],
            },
            'FieldDefinition[parent.name.value=Mutation]': {
              style: 'camelCase',
              forbiddenPrefixes: ['mutation'],
              forbiddenSuffixes: ['Mutation'],
            },
            'FieldDefinition[parent.name.value=Subscription]': {
              style: 'camelCase',
              forbiddenPrefixes: ['subscription'],
              forbiddenSuffixes: ['Subscription'],
            },
            'EnumTypeDefinition,EnumTypeExtension': {
              forbiddenPrefixes: ['Enum'],
              forbiddenSuffixes: ['Enum'],
            },
            'InterfaceTypeDefinition,InterfaceTypeExtension': {
              forbiddenPrefixes: ['Interface'],
              forbiddenSuffixes: ['Interface'],
            },
            'UnionTypeDefinition,UnionTypeExtension': {
              forbiddenPrefixes: ['Union'],
              forbiddenSuffixes: ['Union'],
            },
            'ObjectTypeDefinition,ObjectTypeExtension': {
              forbiddenPrefixes: ['Type'],
              forbiddenSuffixes: ['Type'],
            },
          },
        ],
        '@graphql-eslint/no-typename-prefix': 'warn',
        '@graphql-eslint/strict-id-in-types': 'off',
        '@graphql-eslint/require-description': 'off',
      },
      parserOptions: {
        operations: '**/*.queries.ts',
        schema: '**/*.graphql',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
    'import/internal-regex': `^@${product}/`,
  },
};
