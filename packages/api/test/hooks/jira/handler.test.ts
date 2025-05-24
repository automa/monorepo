import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, server } from '../../utils';

suite('jira hook', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('with no event should return 401', async () => {
    const response = await call(app, '/hooks/jira', {
      method: 'POST',
      payload: {},
    });

    assert.equal(response.statusCode, 401);
  });

  test('with no body should return 401', async () => {
    const response = await call(app, '/hooks/jira', {
      method: 'POST',
    });

    assert.equal(response.statusCode, 401);
  });

  test('with unhandled event should return 204', async () => {
    const response = await call(app, '/hooks/jira', {
      method: 'POST',
      payload: {
        webhookEvent: 'unhandled',
      },
    });

    assert.equal(response.statusCode, 204);
  });
});
