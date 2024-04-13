import { readFileSync } from 'fs';
import { join } from 'path';

import { assert } from 'chai';
import yaml from 'js-yaml';

import { fromDependabot, validateDependabot } from '../src/dependabot';
import { Config } from '../src/dependabot/types';
import { DependencyEcosystem } from '../src/types';

const convert = (fixture: string) => {
  const value = readFileSync(
    join(__dirname, `fixtures/dependabot/${fixture}.yml`),
    'utf8',
  );
  return fromDependabot(yaml.load(value) as Config);
};

suite('dependabot', () => {
  suite('validate', () => {
    test('works with valid config', () => {
      assert.isNull(
        validateDependabot({
          version: 2,
          updates: [],
        }),
      );
    });

    test('errors with invalid config', () => {
      assert.isNotNull(validateDependabot({} as Config));
    });
  });

  suite.only('convert', () => {
    test('should convert empty', () => {
      assert.deepEqual(convert('empty'), {
        enabled: false,
        groups: [],
      });
    });

    test('should convert basic with defaults', () => {
      assert.deepEqual(convert('basic'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert directory', () => {
      assert.deepEqual(convert('directory'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            manifests: ['/app/**'],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert limit setting', () => {
      assert.deepEqual(convert('limit'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 10,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert limit = 0 setting', () => {
      assert.deepEqual(convert('limit_zero'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            enabled: false,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert repository settings', () => {
      assert.deepEqual(convert('repository'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              assignees: ['octocat', 'my-org/my-team'],
              labels: ['npm dependencies', 'security'],
              reviewers: ['octocat', 'my-org/my-team'],
            },
          },
        ],
      });
    });

    test('should convert empty labels setting', () => {
      assert.deepEqual(convert('labels_empty'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              labels: [],
            },
          },
        ],
      });
    });

    test('should convert allow settings', () => {
      assert.deepEqual(convert('allow'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchPackagePatterns: ['@storybook/*'],
            matchDepTypes: ['development'],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchPackagePatterns: ['react*'],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert ignore settings', () => {
      assert.deepEqual(convert('ignore'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert groups settings', () => {
      assert.deepEqual(convert('groups'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchDepTypes: ['production'],
            combined: true,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            excludePackagePatterns: ['eslint*', 'prettier*', '@angular/*'],
            matchDepTypes: ['development'],
            combined: true,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchPackagePatterns: ['eslint*', 'prettier*'],
            combined: true,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchPackagePatterns: ['@angular/*'],
            matchUpdateTypes: ['minor', 'patch'],
            combined: true,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert groups with allow & ignore settings', () => {
      assert.deepEqual(convert('groups_allow_ignore'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            excludePackagePatterns: ['eslint*', 'prettier*', '@angular/*'],
            matchDepTypes: ['development'],
            combined: true,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            limit: 5,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });

    test('should convert groups with limit = 0 settings', () => {
      assert.deepEqual(convert('groups_limit_zero'), {
        groups: [
          {
            ecosystems: [DependencyEcosystem.NPM],
            matchDepTypes: ['production'],
            combined: true,
            enabled: false,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
          {
            ecosystems: [DependencyEcosystem.NPM],
            enabled: false,
            repository: {
              labels: ['dependencies', 'javascript'],
            },
          },
        ],
      });
    });
  });
});
