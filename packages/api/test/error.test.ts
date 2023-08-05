import { assert } from 'chai';
import { FastifyInstance } from 'fastify';

import { server, call } from './utils';

suite('error', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('unhandled routes return 404', async () => {
    const response = await call(app, '/unhandled-route');

    assert.equal(response.statusCode, 404);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const data = response.json();

    assert.equal(data.error, 'Not Found');
    assert.equal(data.statusCode, 404);
  });
});
