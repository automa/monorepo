import { createPrivateKey } from 'crypto';

import { FastifyInstance } from 'fastify';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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
  installationId: string,
  id: string,
  pem: string,
) => {
  const token = generateAppToken(id, pem);

  const { data } = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(data);

  return data.token as string;
};

export const caller = async (app: FastifyInstance, installationId: string) => {
  const accessToken = await getInstallationAccessToken(
    installationId,
    app.config.GITHUB_APP.ID,
    app.config.GITHUB_APP.PEM,
  );

  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Automa App',
    },
  });
};
