import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate', () => {
  test('empty object is valid', () => {
    assert.isNull(validate({}));
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        // @ts-ignore
        foo: 'bar',
      }),
      [
        {
          instancePath: '',
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
});
