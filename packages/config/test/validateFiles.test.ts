import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots files', () => {
  test('empty object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {},
        },
      }),
      [
        {
          instancePath: '/bots/files',
          keyword: 'required',
          message: "must have required property 'groups'",
          params: {
            missingProperty: 'groups',
          },
          schemaPath: '#/required',
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
              },
            ],
            foo: 'bar',
          },
        },
      }),
      [
        {
          instancePath: '/bots/files',
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
          files: {
            groups: null,
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups',
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
          files: {
            groups: 'foo',
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups',
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
