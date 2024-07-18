import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, server } from './utils';

suite('health', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('returns 200', async () => {
    const response = await call(app, '/health/live');

    assert.equal(response.statusCode, 200);

    const data = response.body;

    assert.isEmpty(data);
  });
});
