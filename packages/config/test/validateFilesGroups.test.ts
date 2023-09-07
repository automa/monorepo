import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots files groups', () => {
  test('empty array is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: '#/properties/groups/minItems',
        },
      ],
    );
  });

  test('an array of empty object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [{}],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0',
          keyword: 'required',
          message: "must have required property 'rules'",
          params: {
            missingProperty: 'rules',
          },
          schemaPath: '#/properties/groups/items/required',
        },
      ],
    );
  });

  test('an array of non-object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [1],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0',
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
          files: {
            groups: [null],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0',
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
          files: {
            groups: [
              {
                rules: {
                  LICENSE:
                    'https://raw.githubusercontent.com/automa/automa/master/LICENSE',
                },
                foo: 'bar',
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0',
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
