import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { orgs, users } from '@automa/prisma';

import {
  call,
  seedOrgs,
  seedUserOrgs,
  seedUsers,
  server,
} from '../../../../../utils';

suite('api/orgs/integrations/connect/github', () => {
  let app: FastifyInstance;
  let org: orgs, user: users;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org] = await seedOrgs(app, 1);
    await seedUserOrgs(app, user, [org]);

    app.addHook('preValidation', async (request) => {
      request.session.orgId = org.id;
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  test('should redirect to github website with app credentials', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/github',
    );

    assert.equal(response.statusCode, 302);

    const location = response.headers.location;

    assert.isString(location);

    assert.match(
      location as string,
      /^https:\/\/github.com\/apps\/automa-test\/installations\/new\/permissions\?target_id=0$/,
    );
  });
});
