import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { users } from '@automa/prisma';

import { graphql, server } from '../utils';

suite('graphql', () => {
  let app: FastifyInstance, sessionUser: users | null;

  suiteSetup(async () => {
    app = await server();

    app.addHook('preHandler', async (request) => {
      request.userId = sessionUser?.id ?? null;
    });
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('without session return 401', async () => {
    const response = await graphql(
      app,
      `
        query me {
          me {
            id
          }
        }
      `,
    );

    assert.equal(response.statusCode, 401);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const { errors } = response.json();

    assert.lengthOf(errors, 1);
    assert.equal(errors[0].message, 'Unauthorized');
    assert.equal(errors[0].extensions.code, 'UNAUTHORIZED');
  });

  test('invalid query return 400', async () => {
    sessionUser = { id: 1 } as users;

    const response = await graphql(
      app,
      `
        query me {
          hi
        }
      `,
    );

    assert.equal(response.statusCode, 400);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const { errors } = response.json();

    assert.lengthOf(errors, 1);
    assert.equal(errors[0].message, 'Cannot query field "hi" on type "Query".');
    assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
  });
});
