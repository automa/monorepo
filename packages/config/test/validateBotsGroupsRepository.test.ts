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

  test('assigneesOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesOverride: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('assigneesOverride being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesOverride: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/assigneesOverride/type',
        },
      ],
    );
  });

  test('assigneesOverride being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesOverride: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/assigneesOverride/type',
        },
      ],
    );
  });

  test('assigneesOverride being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesOverride: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/assigneesOverride/items/type',
        },
      ],
    );
  });

  test('assigneesOverride being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  assigneesOverride: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/assigneesOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/assigneesOverride/items/type',
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

  test('labelsOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsOverride: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('labelsOverride being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsOverride: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/labelsOverride/type',
        },
      ],
    );
  });

  test('labelsOverride being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsOverride: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/labelsOverride/type',
        },
      ],
    );
  });

  test('labelsOverride being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsOverride: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/labelsOverride/items/type',
        },
      ],
    );
  });

  test('labelsOverride being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  labelsOverride: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/repository/labelsOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/labelsOverride/items/type',
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

  test('reviewersOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersOverride: ['foo', 'bar'],
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('reviewersOverride being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersOverride: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/reviewersOverride/type',
        },
      ],
    );
  });

  test('reviewersOverride being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersOverride: 'foo',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersOverride',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/reviewersOverride/type',
        },
      ],
    );
  });

  test('reviewersOverride being an array of non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersOverride: [1],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/reviewersOverride/items/type',
        },
      ],
    );
  });

  test('reviewersOverride being an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                repository: {
                  reviewersOverride: [null],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath:
            '/bots/dependency/groups/0/repository/reviewersOverride/0',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/reviewersOverride/items/type',
        },
      ],
    );
  });
});
