import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import {
  call,
  seedOrgs,
  seedUserOrgs,
  seedUsers,
  server,
} from '../../../../../utils';

suite('api/orgs/integrations/connect', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();

    const [user] = await seedUsers(app, 1);
    const [org] = await seedOrgs(app, 2);
    await seedUserOrgs(app, user, [org]);

    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        integration_type: 'linear',
        created_by: user.id,
      },
    });

    app.addHook('preValidation', async (request) => {
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  test('should redirect if integration is already connected', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/linear',
    );

    assert.equal(response.statusCode, 302);

    assert.equal(
      response.headers.location,
      'http://localhost:3000/org-0/integrations',
    );
  });
});
