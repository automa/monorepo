import { FastifyInstance } from 'fastify';
import axios from 'axios';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
    };
  }>('/github', async (request, reply) => {
    const { code } = request.query;

    if (!code) {
      return reply.badRequest();
    }

    const { data } = await axios.post<{
      access_token: string;
      refresh_token: string;
      refresh_token_expires_in: string;
    }>(
      'https://github.com/login/oauth/access_token',
      {
        client_id: app.config.GITHUB_APP.CLIENT_ID,
        client_secret: app.config.GITHUB_APP.CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );

    console.log(data);

    reply.status(200).send();
  });
}
