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
});
