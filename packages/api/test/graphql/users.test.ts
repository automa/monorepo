import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { users } from '@automa/prisma';

import { graphql, seedUsers, server } from '../utils';

suite('graphql users', () => {
  let app: FastifyInstance;
  let user: users, secondUser: users;

  suiteSetup(async () => {
    app = await server();

    [user, secondUser] = await seedUsers(app, 2);

    await app.prisma.user_providers.createMany({
      data: [
        {
          user_id: user.id,
          provider_type: 'github',
          provider_id: '123',
          provider_email: 'pavan@example.com',
          refresh_token: 'acbdef',
        },
        {
          user_id: user.id,
          provider_type: 'gitlab',
          provider_id: '123',
          provider_email: 'pavan.sunkara@example.com',
          refresh_token: 'acbdef',
        },
        {
          user_id: secondUser.id,
          provider_type: 'github',
          provider_id: '456',
          provider_email: 'john@example.com',
          refresh_token: 'acbdef',
        },
      ],
    });

    app.addHook('preHandler', async (request) => {
      request.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query me', () => {
    let response: LightMyRequestResponse;

    setup(async () => {
      response = await graphql(
        app,
        `
          query me {
            me {
              id
              name
              email
              providers {
                id
                provider_type
                provider_id
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

    test('should return user', async () => {
      const {
        data: { me },
      } = response.json();

      assert.isNumber(me.id);
      assert.equal(me.name, 'User 0');
      assert.equal(me.email, 'user-0@example.com');
    });

    test("should return user's providers only", async () => {
      const {
        data: { me },
      } = response.json();

      assert.lengthOf(me.providers, 2);

      assert.isNumber(me.providers[0].id);
      assert.equal(me.providers[0].provider_type, 'github');
      assert.equal(me.providers[0].provider_id, '123');

      assert.isNumber(me.providers[1].id);
      assert.equal(me.providers[1].provider_type, 'gitlab');
      assert.equal(me.providers[1].provider_id, '123');
    });
  });

  suite('mutation userUpdate', () => {
    teardown(async () => {
      await app.prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          name: 'User 0',
          email: 'user-0@example.com',
        },
      });
    });

    test('with valid input should succeed', async () => {
      const response = await userUpdate(app, {
        name: 'Pavan Sunkara',
        email: 'pavan@automa.app',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { userUpdate: updatedUser },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(updatedUser.id);
      assert.equal(updatedUser.name, 'Pavan Sunkara');
      assert.equal(updatedUser.email, 'pavan@automa.app');

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'Pavan Sunkara');
      assert.equal(readUser.email, 'pavan@automa.app');
    });

    test('with missing name should fail', async () => {
      const response = await userUpdate(app, {
        email: 'pavan@automa.app',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "name" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'User 0');
      assert.equal(readUser.email, 'user-0@example.com');
    });

    test('with short name should fail', async () => {
      const response = await userUpdate(app, {
        name: 'b',
        email: 'pavan@automa.app',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_small',
          message: 'String must contain at least 3 character(s)',
          path: ['name'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'User 0');
      assert.equal(readUser.email, 'user-0@example.com');
    });

    test('with long name should fail', async () => {
      const response = await userUpdate(app, {
        name: 'a'.repeat(256),
        email: 'pavan@automa.app',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_big',
          message: 'String must contain at most 255 character(s)',
          path: ['name'],
          type: 'string',
          inclusive: true,
          exact: false,
          maximum: 255,
        },
      ]);

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'User 0');
      assert.equal(readUser.email, 'user-0@example.com');
    });

    test('with missing email should fail', async () => {
      const response = await userUpdate(app, {
        name: 'Pavan Sunkara',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "email" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'User 0');
      assert.equal(readUser.email, 'user-0@example.com');
    });

    test('with invalid email should fail', async () => {
      const response = await userUpdate(app, {
        name: 'Pavan Sunkara',
        email: 'pavan',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'invalid_string',
          message: 'Invalid email',
          path: ['email'],
          validation: 'email',
        },
      ]);

      const readUser = await app.prisma.users.findFirstOrThrow({
        where: {
          id: user.id,
        },
      });

      assert.equal(readUser.name, 'User 0');
      assert.equal(readUser.email, 'user-0@example.com');
    });
  });
});

const userUpdate = (app: FastifyInstance, input: any) =>
  graphql(
    app,
    `
      mutation userUpdate($input: UserUpdateInput!) {
        userUpdate(input: $input) {
          id
          name
          email
        }
      }
    `,
    {
      input,
    },
  );
