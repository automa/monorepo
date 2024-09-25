import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, seedUsers, server } from '../../utils';

suite('api', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();

    await seedUsers(app, 1);
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.close();
  });

  test('should return unauthorized if the user is not logged in', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/linear',
    );

    assert.equal(response.statusCode, 401);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const data = response.json();

    assert.equal(data.error, 'Unauthorized');
    assert.equal(data.statusCode, 401);
  });
});
