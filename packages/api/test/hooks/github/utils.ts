import { FastifyInstance } from 'fastify';

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { createHmac } from 'crypto';

import { env } from '../../../src/env';

import { call } from '../../utils';

export const callWithFixture = async (
  app: FastifyInstance,
  event: string,
  fileName: string,
) => {
  const body = JSON.parse(
    readFileSync(
      join(
        dirname(dirname(__dirname)),
        'fixtures',
        'hooks',
        'github',
        event,
        `${fileName}.json`,
      ),
      'utf8',
    ),
  );

  let hmac = createHmac('sha256', env.GITHUB_APP.WEBHOOK_SECRET);
  hmac = hmac.update(JSON.stringify(body));

  return call(app, '/hooks/github', {
    method: 'POST',
    headers: {
      'x-github-event': event,
      'x-hub-signature-256': `sha256=${hmac.digest('hex')}`,
    },
    payload: body,
  });
};

export const encodeSettings = (fileName: string) => {
  const data = readFileSync(
    join(
      dirname(dirname(__dirname)),
      'fixtures',
      'settings',
      `${fileName}.json`,
    ),
    'utf8',
  );

  return {
    data: {
      content: Buffer.from(data).toString('base64'),
    },
  };
};
