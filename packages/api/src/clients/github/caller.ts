import { createPrivateKey } from 'crypto';

import { FastifyInstance } from 'fastify';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { env } from '../../env';
import { createAxiosInstance } from '../utils';

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
) => {
  const token = generateAppToken(id, pem);

  const { data } = await axios.post(
    `${uri}/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.token as string;
};

export const caller = async (app: FastifyInstance, installationId: number) => {
  const { GITHUB_APP } = env;

  const accessToken = await getInstallationAccessToken(
    installationId,
    GITHUB_APP.API_URI,
    GITHUB_APP.ID,
    GITHUB_APP.PEM,
  );

  const { axiosInstance, paginate } = createAxiosInstance({
    baseURL: GITHUB_APP.API_URI,
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Automa App',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    accessToken,
    axios: axiosInstance,
    paginate,
  };
};
