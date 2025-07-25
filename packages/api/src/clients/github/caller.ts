import { createPrivateKey } from 'node:crypto';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import { env } from '../../env';

import { createAxiosInstance } from '../utils';

export const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'Automa App',
  'X-GitHub-Api-Version': '2022-11-28',
};

const generateAppToken = (id: string, pem: string) => {
  const claims = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    iss: id,
  };

  return jwt.sign(claims, createPrivateKey(pem), {
    algorithm: 'RS256',
  });
};

// Get github installation's access token
const getInstallationAccessToken = async (
  installationId: number,
  uri: string,
  id: string,
  pem: string,
  repositoryIds?: number[],
  permissions?: Record<string, 'read' | 'write' | 'admin'>,
) => {
  const token = generateAppToken(id, pem);

  const { data } = await axios.post(
    `${uri}/app/installations/${installationId}/access_tokens`,
    {
      ...(repositoryIds ? { repository_ids: repositoryIds } : {}),
      ...(permissions ? { permissions } : {}),
    },
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.token as string;
};

export const createCallers = (accessToken: string) => {
  const { GITHUB_APP } = env;

  const { axiosInstance, paginate } = createAxiosInstance({
    baseURL: GITHUB_APP.API_URI,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    axios: axiosInstance,
    paginate,
  };
};

export const caller = async (
  installationId: number,
  ...args: Parameters<typeof getInstallationAccessToken> extends [
    unknown,
    unknown,
    unknown,
    unknown,
    ...infer Rest,
  ]
    ? Rest
    : never
) => {
  const { GITHUB_APP } = env;

  const accessToken = await getInstallationAccessToken(
    installationId,
    GITHUB_APP.API_URI,
    GITHUB_APP.CLIENT_ID,
    GITHUB_APP.PEM,
    ...args,
  );

  return {
    accessToken,
    ...createCallers(accessToken),
  };
};
