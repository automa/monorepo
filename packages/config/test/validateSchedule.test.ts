import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - schedule', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        schedule: {},
      }),
    );
  });

  test('additional properties are invalid', () => {
    assert.deepEqual(
      validate({
        schedule: {
          // @ts-ignore
          foo: 'bar',
        },
      }),
      [
        {
          instancePath: '/schedule',
          keyword: 'additionalProperties',
          message: 'must NOT have additional properties',
          params: {
            additionalProperty: 'foo',
          },
          schemaPath: 'schedule.schema.json/additionalProperties',
        },
      ],
    );
  });
});
