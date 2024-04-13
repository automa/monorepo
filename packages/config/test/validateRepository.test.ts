import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - repository', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        repository: {},
      }),
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        repository: {
          // @ts-ignore
          foo: 'bar',
        },
      }),
      [
        {
          instancePath: '/repository',
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
        repository: {
          assignees: ['foo', 'bar'],
        },
      }),
    );
  });

  test('assignees being null is invalid', () => {
    assert.deepEqual(
      validate({
        repository: {
          // @ts-ignore
          assignees: null,
        },
      }),
      [
        {
          instancePath: '/repository/assignees',
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
        repository: {
          // @ts-ignore
          assignees: 'foo',
        },
      }),
      [
        {
          instancePath: '/repository/assignees',
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
        repository: {
          // @ts-ignore
          assignees: [1],
        },
      }),
      [
        {
          instancePath: '/repository/assignees/0',
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
        repository: {
          // @ts-ignore
          assignees: [null],
        },
      }),
      [
        {
          instancePath: '/repository/assignees/0',
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
        repository: {
          assignees: [],
        },
      }),
      [
        {
          instancePath: '/repository/assignees',
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
        repository: {
          assignees: [''],
        },
      }),
      [
        {
          instancePath: '/repository/assignees/0',
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
        repository: {
          assignees: ['foo', 'foo'],
        },
      }),
      [
        {
          instancePath: '/repository/assignees',
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

  test('labels being an array of strings is valid', () => {
    assert.isNull(
      validate({
        repository: {
          labels: ['foo', 'bar'],
        },
      }),
    );
  });

  test('labels being null is invalid', () => {
    assert.deepEqual(
      validate({
        repository: {
          // @ts-ignore
          labels: null,
        },
      }),
      [
        {
          instancePath: '/repository/labels',
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
        repository: {
          // @ts-ignore
          labels: 'foo',
        },
      }),
      [
        {
          instancePath: '/repository/labels',
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
        repository: {
          // @ts-ignore
          labels: [1],
        },
      }),
      [
        {
          instancePath: '/repository/labels/0',
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
        repository: {
          // @ts-ignore
          labels: [null],
        },
      }),
      [
        {
          instancePath: '/repository/labels/0',
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
        repository: {
          labels: [],
        },
      }),
      [
        {
          instancePath: '/repository/labels',
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
        repository: {
          labels: [''],
        },
      }),
      [
        {
          instancePath: '/repository/labels/0',
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
        repository: {
          labels: ['foo', 'foo'],
        },
      }),
      [
        {
          instancePath: '/repository/labels',
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

  test('reviewers being an array of strings is valid', () => {
    assert.isNull(
      validate({
        repository: {
          reviewers: ['foo', 'bar'],
        },
      }),
    );
  });

  test('reviewers being null is invalid', () => {
    assert.deepEqual(
      validate({
        repository: {
          // @ts-ignore
          reviewers: null,
        },
      }),
      [
        {
          instancePath: '/repository/reviewers',
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
        repository: {
          // @ts-ignore
          reviewers: 'foo',
        },
      }),
      [
        {
          instancePath: '/repository/reviewers',
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
        repository: {
          // @ts-ignore
          reviewers: [1],
        },
      }),
      [
        {
          instancePath: '/repository/reviewers/0',
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
        repository: {
          // @ts-ignore
          reviewers: [null],
        },
      }),
      [
        {
          instancePath: '/repository/reviewers/0',
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
        repository: {
          reviewers: [],
        },
      }),
      [
        {
          instancePath: '/repository/reviewers',
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
        repository: {
          reviewers: [''],
        },
      }),
      [
        {
          instancePath: '/repository/reviewers/0',
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
        repository: {
          reviewers: ['foo', 'foo'],
        },
      }),
      [
        {
          instancePath: '/repository/reviewers',
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
});
