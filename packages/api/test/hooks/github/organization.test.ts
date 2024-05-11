import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { orgs } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture } from './utils';

suite('github hook organization event', () => {
  let app: FastifyInstance,
    response: LightMyRequestResponse,
    organization: orgs;

  suiteSetup(async () => {
    app = await server();

    organization = await app.prisma.orgs.create({
      data: {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
        provider_name: 'automa',
        is_user: false,
        has_installation: true,
        github_installation_id: 40335964,
      },
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  suite('renamed', () => {
    setup(async () => {
      response = await callWithFixture(app, 'organization', 'renamed');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should update organization provider name', async () => {
      const org = await app.prisma.orgs.findFirstOrThrow({
        where: {
          id: organization.id,
        },
      });

      assert.deepOwnInclude(org, {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
        provider_name: 'automa-app',
        is_user: false,
        has_installation: true,
        github_installation_id: 40335964,
      });
    });
  });
});
