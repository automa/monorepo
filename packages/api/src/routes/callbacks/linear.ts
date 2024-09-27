import { FastifyInstance } from 'fastify';
import { LinearClient } from '@linear/sdk';
import axios from 'axios';

import { ErrorType } from '@automa/common';
import { integration } from '@automa/prisma';

import { env } from '../../env';
import { logger, SeverityNumber } from '../../telemetry';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
      state: string;
    };
  }>('/linear', async (request, reply) => {
    const { LINEAR_APP, BASE_URI, CLIENT_URI } = env;

    const org = await app.prisma.orgs.findFirst({
      where: {
        id: request.session?.orgId,
      },
    });

    const referer = org ? `${CLIENT_URI}/${org.name}/integrations` : CLIENT_URI;

    const replyError = (code: number) =>
      reply.redirect(`${referer}?error=${code}`);

    const { code, state } = request.query;

    if (!org || !code || !state) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    if (request.session.integrationOauthState !== state) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    const {
      data: { access_token: accessToken, scope },
    } = await axios.post<{
      access_token: string;
      scope: string;
    }>(
      LINEAR_APP.ACCESS_TOKEN_URL,
      {
        client_id: LINEAR_APP.CLIENT_ID,
        client_secret: LINEAR_APP.CLIENT_SECRET,
        redirect_uri: `${BASE_URI}${LINEAR_APP.CALLBACK_URI}`,
        code,
        grant_type: 'authorization_code',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      },
    );

    if (!accessToken) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    const client = new LinearClient({ accessToken });

    const [linearOrg, linearUser] = await Promise.all([
      client.organization,
      client.viewer,
    ]);

    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Connected Linear integration',
      attributes: {
        orgId: org.id,
        linearOrgName: linearOrg.name,
        linearOrgSlug: linearOrg.urlKey,
        linearUserEmail: linearUser.email,
        linearUserActive: linearUser.active,
        linearUserAdmin: linearUser.admin,
        linearUserGuest: linearUser.guest,
      },
    });

    // Linear sends us an event when the user is deactivated or the app is revoked.
    // We also don't get any webhooks after that happens. Therefore, we don't need
    // to constantly keep checking if the connection is still valid.
    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        type: integration.linear,
        secrets: {
          access_token: accessToken,
        },
        config: {
          id: linearOrg.id,
          name: linearOrg.name,
          slug: linearOrg.urlKey,
          scopes: scope.split(' '),
          userEmail: linearUser.email,
        },
        created_by: request.userId!,
      },
    });

    return reply.redirect(referer);
  });
}
