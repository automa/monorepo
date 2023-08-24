import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots files groups rules', () => {
  test('empty object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {},
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0/rules',
          keyword: 'minProperties',
          message: 'must NOT have fewer than 1 properties',
          params: {
            limit: 1,
          },
          schemaPath:
            '#/properties/groups/items/properties/rules/minProperties',
        },
      ],
    );
  });

  test('values being a url is valid', () => {
    assert.isNull(
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
          },
        },
      }),
    );
  });

  test('values being a string is valid', () => {
    assert.isNull(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {
                  LICENSE: 'foo',
                },
              },
            ],
          },
        },
      }),
    );
  });

  test('values being null is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {
                  LICENSE: null,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0/rules/LICENSE',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath:
            '#/properties/groups/items/properties/rules/additionalProperties/type',
        },
      ],
    );
  });

  test('values being a non-string is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {
                  LICENSE: 1,
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0/rules/LICENSE',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath:
            '#/properties/groups/items/properties/rules/additionalProperties/type',
        },
      ],
    );
  });

  test('values being an array is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {
                  LICENSE: [],
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0/rules/LICENSE',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath:
            '#/properties/groups/items/properties/rules/additionalProperties/type',
        },
      ],
    );
  });

  test('values being an object is invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          files: {
            groups: [
              {
                rules: {
                  LICENSE: {},
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/files/groups/0/rules/LICENSE',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath:
            '#/properties/groups/items/properties/rules/additionalProperties/type',
        },
      ],
    );
  });
});
