import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots dependency', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {},
        },
      }),
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            foo: 'bar',
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency',
          keyword: 'additionalProperties',
          message: 'must NOT have additional properties',
          params: {
            additionalProperty: 'foo',
          },
          schemaPath: '#/additionalProperties',
        },
      ],
    );
  });

  test('groups being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: null,
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/groups/type',
        },
      ],
    );
  });

  test('groups being a string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            groups: 'foo',
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups',
          keyword: 'type',
          message: 'must be array',
          params: {
            type: 'array',
          },
          schemaPath: '#/properties/groups/type',
        },
      ],
    );
  });
});
