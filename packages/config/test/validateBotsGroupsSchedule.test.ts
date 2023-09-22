import { assert } from 'chai';

import { validate } from '../src/validate';

suite('validate - bots * groups schedule', () => {
  test('empty object is valid', () => {
    assert.isNull(
      validate({
        bots: {
          dependency: {
            groups: [
              {
                schedule: {},
              },
            ],
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
            groups: [
              {
                schedule: {
                  // @ts-ignore
                  foo: 'bar',
                },
              },
            ],
          },
        },
      }),
      [
        {
          instancePath: '/bots/dependency/groups/0/schedule',
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
