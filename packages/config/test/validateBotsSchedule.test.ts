import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots * schedule', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            schedule: {},
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
            schedule: {
              // @ts-ignore
              foo: 'bar',
            },
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/schedule',
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
