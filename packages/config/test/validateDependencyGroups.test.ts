import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots dependency groups', () => {
  test('empty array is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [],
          },
        },
      }),
    );
  });

  test('an array of empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [{}],
          },
        },
      }),
    );
  });

  test('an array of non-object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            // @ts-ignore
            groups: [1],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0',
          keyword: 'type',
          message: 'must be object',
          params: {
            type: 'object',
          },
          schemaPath: '#/properties/groups/items/type',
        },
      ],
    );
  });

  test('an array of null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            // @ts-ignore
            groups: [null],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0',
          keyword: 'type',
          message: 'must be object',
          params: {
            type: 'object',
          },
          schemaPath: '#/properties/groups/items/type',
        },
      ],
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          dependency: {
            // @ts-ignore
            groups: [{ foo: 'bar' }],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0',
          keyword: 'additionalProperties',
          message: 'must NOT have additional properties',
          params: {
            additionalProperty: 'foo',
          },
          schemaPath: '#/properties/groups/items/additionalProperties',
        },
      ],
    );
  });
});
