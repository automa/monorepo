import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, seedOrgs, seedUsers, server } from '../../../utils';

suite('api/orgs', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();

    const [user] = await seedUsers(app, 1);
    await seedOrgs(app, 1);

    app.addHook('preValidation', async (request) => {
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  test('should return 404 if the org does not exist', async () => {
    const response = await call(
      app,
      '/api/orgs/org-404/integrations/connect/linear',
    );

    assert.equal(response.statusCode, 404);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const data = response.json();

    assert.equal(data.error, 'Not Found');
    assert.equal(data.statusCode, 404);
  });

  test('should return 404 if user do not belong to the org', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/linear',
    );

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
