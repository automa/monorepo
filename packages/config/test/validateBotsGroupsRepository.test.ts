import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots * groups repository', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {},
              },
            ],
          },
        },
      }),
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  foo: 'bar',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository',
          keyword: 'unevaluatedProperties',
          message: 'must NOT have unevaluated properties',
          params: {
            unevaluatedProperty: 'foo',
          },
          schemaPath: '#/unevaluatedProperties',
        },
      ],
    );
  });

  test('assignees being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assignees: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('assignees being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assignees: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assignees',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/assignees/type',
        },
      ],
    );
  });

  test('assignees being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assignees: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assignees',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/assignees/type',
        },
      ],
    );
  });

  test('assignees being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assignees: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assignees/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/assignees/items/type',
        },
      ],
    );
  });

  test('assignees being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assignees: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assignees/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/assignees/items/type',
        },
      ],
    );
  });

  test('assigneesReplace being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesReplace: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('assigneesReplace being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesReplace: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assigneesReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/assigneesReplace/type',
        },
      ],
    );
  });

  test('assigneesReplace being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesReplace: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/assigneesReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/assigneesReplace/type',
        },
      ],
    );
  });

  test('assigneesReplace being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesReplace: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/assigneesReplace/items/type',
        },
      ],
    );
  });

  test('assigneesReplace being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesReplace: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/assigneesReplace/items/type',
        },
      ],
    );
  });

  test('labels being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labels: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('labels being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labels: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labels',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/labels/type',
        },
      ],
    );
  });

  test('labels being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labels: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labels',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/labels/type',
        },
      ],
    );
  });

  test('labels being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labels: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labels/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/labels/items/type',
        },
      ],
    );
  });

  test('labels being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labels: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labels/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/labels/items/type',
        },
      ],
    );
  });

  test('labelsReplace being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsReplace: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('labelsReplace being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsReplace: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/labelsReplace/type',
        },
      ],
    );
  });

  test('labelsReplace being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsReplace: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/labelsReplace/type',
        },
      ],
    );
  });

  test('labelsReplace being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsReplace: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/labelsReplace/items/type',
        },
      ],
    );
  });

  test('labelsReplace being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsReplace: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/labelsReplace/items/type',
        },
      ],
    );
  });

  test('reviewers being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewers: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('reviewers being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewers: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewers',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/reviewers/type',
        },
      ],
    );
  });

  test('reviewers being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewers: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewers',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: 'repository.schema.json/properties/reviewers/type',
        },
      ],
    );
  });

  test('reviewers being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewers: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewers/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/reviewers/items/type',
        },
      ],
    );
  });

  test('reviewers being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewers: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewers/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: 'repository.schema.json/properties/reviewers/items/type',
        },
      ],
    );
  });

  test('reviewersReplace being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersReplace: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('reviewersReplace being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersReplace: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewersReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/reviewersReplace/type',
        },
      ],
    );
  });

  test('reviewersReplace being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersReplace: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/reviewersReplace',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/reviewersReplace/type',
        },
      ],
    );
  });

  test('reviewersReplace being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersReplace: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/reviewersReplace/items/type',
        },
      ],
    );
  });

  test('reviewersReplace being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersReplace: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersReplace/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/reviewersReplace/items/type',
        },
      ],
    );
  });
});
