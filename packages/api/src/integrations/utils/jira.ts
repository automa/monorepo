import { FastifyInstance } from 'fastify';
import axios, { AxiosError } from 'axios';

import { env } from '../../env';

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export async function withJiraTokenRefresh<T>(
  app: FastifyInstance,
  integrationId: number,
  tokens: TokenPair,
  apiCall: (accessToken: string) => Promise<T>,
): Promise<{
  result: T;
  tokens: TokenPair;
}> {
  const { JIRA_APP } = env;

  try {
    const result = await apiCall(tokens.access_token);

    return { result, tokens };
  } catch (e) {
    if ((e as AxiosError)?.response?.status !== 401) throw e;

    // If the access token is expired, we need to refresh it
    const { data: newTokens } = await axios.post<TokenPair>(
      JIRA_APP.ACCESS_TOKEN_URL,
      {
        client_id: JIRA_APP.CLIENT_ID,
        client_secret: JIRA_APP.CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
        grant_type: 'refresh_token',
      },
    );

    if (!newTokens.access_token || !newTokens.refresh_token) throw e;

    const [result] = await Promise.all([
      apiCall(newTokens.access_token),
      app.prisma.integrations.update({
        where: {
          id: integrationId,
        },
        data: {
          secrets: {
            refresh_token: newTokens.refresh_token,
            access_token: newTokens.access_token,
          },
        },
      }),
    ]);

    return { result, tokens: newTokens };
  }
}
