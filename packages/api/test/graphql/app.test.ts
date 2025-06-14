import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { graphql, server } from '../utils';

suite('graphql app', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  suite('query app', () => {
    let response: LightMyRequestResponse;

    setup(async () => {
      response = await graphql(
        app,
        `
          query app {
            app {
              cloud
              client_uri
              integrations {
                github
                gitlab
                linear
                jira
                slack
              }
            }
          }
        `,
      );
    });

    test('should be successful', () => {
      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );
    });

    test('should have no errors', async () => {
      const { errors } = response.json();

      assert.isUndefined(errors);
    });

    test('should return app', async () => {
      const {
        data: { app },
      } = response.json();

      assert.isTrue(app.cloud);
      assert.equal(app.client_uri, 'http://localhost:3000');

      assert.isTrue(app.integrations.github);
      assert.isFalse(app.integrations.gitlab);
      assert.isTrue(app.integrations.linear);
      assert.isTrue(app.integrations.jira);
      assert.isFalse(app.integrations.slack);
    });
  });
});
