import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {},
      }),
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        bots: {
          foo: 'bar',
        },
      }),
      [
        {
          instancePath: '/bots',
          keyword: 'additionalProperties',
          message: 'must NOT have additional properties',
          params: {
            additionalProperty: 'foo',
          },
          schemaPath: '#/properties/bots/additionalProperties',
        },
      ],
    );
  });
});
