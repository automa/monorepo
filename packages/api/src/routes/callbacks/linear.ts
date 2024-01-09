import { FastifyInstance } from 'fastify';
import axios from 'axios';
import generate from 'better-random-words';

import { ErrorType } from '@automa/common';
import { project_provider } from '@automa/prisma';

import { env } from '../../env';

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

    const referer = org
      ? `${CLIENT_URI}/orgs/${org.provider_type}/${org.name}/integrations/projects`
      : CLIENT_URI;

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
      data: { access_token: accessToken },
    } = await axios.post<{
      access_token: string;
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

    await app.prisma.org_project_providers.create({
      data: {
        org_id: org.id,
        provider_type: project_provider.linear,
        name: generate({ exactly: 2, join: '-' }),
        config: {
          access_token: accessToken,
        },
        created_by: request.user!.id,
      },
    });

    return reply.redirect(referer);
  });
}
