import { FastifyInstance } from 'fastify';
import { AuthenticationLinearError } from '@linear/sdk';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { env } from '../../env';

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

type RefreshConfig = {
  env: { ACCESS_TOKEN_URL: string; CLIENT_ID: string; CLIENT_SECRET: string };
  throwOn?: (e: unknown) => boolean;
  requestConfig?: AxiosRequestConfig;
};

const refreshConfigs: Record<string, RefreshConfig> = {
  jira: {
    env: env.JIRA_APP,
    throwOn: (e: unknown) => (e as AxiosError)?.response?.status !== 401,
  },
  linear: {
    env: env.LINEAR_APP,
    throwOn: (e: unknown) => !(e instanceof AuthenticationLinearError),
    requestConfig: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    },
  },
};

export async function withTokenRefresh<T>(
  app: FastifyInstance,
  type: keyof typeof refreshConfigs,
  integrationId: number,
  tokens: TokenPair,
  apiCall: (accessToken: string) => Promise<T>,
): Promise<{
  result: T;
  tokens: TokenPair;
}> {
  try {
    const result = await apiCall(tokens.access_token);

    return { result, tokens };
  } catch (e) {
    const config = refreshConfigs[type];

    if (config.throwOn?.(e)) throw e;

    // If the access token is expired, we need to refresh it
    const { data: newTokens } = await axios.post<TokenPair>(
      config.env.ACCESS_TOKEN_URL,
      {
        client_id: config.env.CLIENT_ID,
        client_secret: config.env.CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
        grant_type: 'refresh_token',
      },
      config.requestConfig ?? {},
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
