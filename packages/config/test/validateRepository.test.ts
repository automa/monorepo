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
});
