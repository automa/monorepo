import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, server } from '../../utils';

suite('linear hook', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('with no event should return 401', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      payload: {},
    });

    assert.equal(response.statusCode, 401);
  });

  test('with no body should return 401', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      headers: {
        'Linear-Event': 'unhandled',
      },
    });

    assert.equal(response.statusCode, 401);
  });

  test('with unhandled event should return 204', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      headers: {
        'Linear-Event': 'unhandled',
      },
      payload: {},
    });

    assert.equal(response.statusCode, 204);
  });

  test('with unhandled action should return 204', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      headers: {
        'Linear-Event': 'Comment',
      },
      payload: {
        action: 'unhandled',
      },
    });

    assert.equal(response.statusCode, 204);
  });

  test('with no signature should return 401', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      headers: {
        'Linear-Event': 'Comment',
      },
      payload: {
        action: 'update',
      },
    });

    assert.equal(response.statusCode, 401);
  });

  test('with invalid signature should return 401', async () => {
    const response = await call(app, '/hooks/linear', {
      method: 'POST',
      headers: {
        'Linear-Event': 'Comment',
        'Linear-Signature': 'invalid',
      },
      payload: {
        action: 'update',
      },
    });

    assert.equal(response.statusCode, 401);
  });
});
