import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots * repository', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {},
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
            repository: {
              // @ts-ignore
              foo: 'bar',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository',
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
            repository: {
              assignees: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              assignees: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees',
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
            repository: {
              // @ts-ignore
              assignees: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees',
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
            repository: {
              // @ts-ignore
              assignees: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees/0',
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
            repository: {
              // @ts-ignore
              assignees: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees/0',
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

  test('assignees being an empty array is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              assignees: [],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: 'repository.schema.json/properties/assignees/minItems',
        },
      ],
    );
  });

  test('assignees being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              assignees: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath:
            'repository.schema.json/properties/assignees/items/minLength',
        },
      ],
    );
  });

  test('assignees being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              assignees: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assignees',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: 'repository.schema.json/properties/assignees/uniqueItems',
        },
      ],
    );
  });

  test('assigneesOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              assigneesOverride: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              assigneesOverride: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride',
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
            repository: {
              // @ts-ignore
              assigneesOverride: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride',
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
            repository: {
              // @ts-ignore
              assigneesOverride: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride/0',
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
            repository: {
              // @ts-ignore
              assigneesOverride: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride/0',
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

  test('assigneesOverride being an empty array is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              assigneesOverride: [],
            },
          },
        },
      }),
    );
  });

  test('assigneesOverride being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              assigneesOverride: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath: '#/properties/assigneesOverride/items/minLength',
        },
      ],
    );
  });

  test('assigneesOverride being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              assigneesOverride: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/assigneesOverride',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: '#/properties/assigneesOverride/uniqueItems',
        },
      ],
    );
  });

  test('labels being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              labels: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              labels: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels',
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
            repository: {
              // @ts-ignore
              labels: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels',
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
            repository: {
              // @ts-ignore
              labels: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels/0',
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
            repository: {
              // @ts-ignore
              labels: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels/0',
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

  test('labels being an empty array is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              labels: [],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: 'repository.schema.json/properties/labels/minItems',
        },
      ],
    );
  });

  test('labels being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              labels: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath:
            'repository.schema.json/properties/labels/items/minLength',
        },
      ],
    );
  });

  test('labels being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              labels: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labels',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: 'repository.schema.json/properties/labels/uniqueItems',
        },
      ],
    );
  });

  test('labelsOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              labelsOverride: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              labelsOverride: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride',
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
            repository: {
              // @ts-ignore
              labelsOverride: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride',
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
            repository: {
              // @ts-ignore
              labelsOverride: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride/0',
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
            repository: {
              // @ts-ignore
              labelsOverride: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride/0',
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

  test('labelsOverride being an empty array is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              labelsOverride: [],
            },
          },
        },
      }),
    );
  });

  test('labelsOverride being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              labelsOverride: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath: '#/properties/labelsOverride/items/minLength',
        },
      ],
    );
  });

  test('labelsOverride being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              labelsOverride: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/labelsOverride',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: '#/properties/labelsOverride/uniqueItems',
        },
      ],
    );
  });

  test('reviewers being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewers: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              reviewers: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers',
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
            repository: {
              // @ts-ignore
              reviewers: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers',
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
            repository: {
              // @ts-ignore
              reviewers: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers/0',
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
            repository: {
              // @ts-ignore
              reviewers: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers/0',
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

  test('reviewers being an empty array is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewers: [],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: 'repository.schema.json/properties/reviewers/minItems',
        },
      ],
    );
  });

  test('reviewers being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewers: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath:
            'repository.schema.json/properties/reviewers/items/minLength',
        },
      ],
    );
  });

  test('reviewers being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewers: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewers',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: 'repository.schema.json/properties/reviewers/uniqueItems',
        },
      ],
    );
  });

  test('reviewersOverride being an array of strings is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewersOverride: ['foo', 'bar'],
            },
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
            repository: {
              // @ts-ignore
              reviewersOverride: null,
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride',
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
            repository: {
              // @ts-ignore
              reviewersOverride: 'foo',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride',
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
            repository: {
              // @ts-ignore
              reviewersOverride: [1],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride/0',
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
            repository: {
              // @ts-ignore
              reviewersOverride: [null],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride/0',
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

  test('reviewersOverride being an empty array is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewersOverride: [],
            },
          },
        },
      }),
    );
  });

  test('reviewersOverride being an array of empty strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewersOverride: [''],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride/0',
          keyword: 'minLength',
          message: 'must NOT have fewer than 1 characters',
          params: {
            limit: 1,
          },
          schemaPath: '#/properties/reviewersOverride/items/minLength',
        },
      ],
    );
  });

  test('reviewersOverride being an array of duplicate strings is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            repository: {
              reviewersOverride: ['foo', 'foo'],
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/repository/reviewersOverride',
          keyword: 'uniqueItems',
          message:
            'must NOT have duplicate items (items ## 1 and 0 are identical)',
          params: {
            i: 0,
            j: 1,
          },
          schemaPath: '#/properties/reviewersOverride/uniqueItems',
        },
      ],
    );
  });
});
