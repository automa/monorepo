import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { FastifyInstance } from 'fastify';

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

  const signature = createHmac('sha256', env.GITHUB_APP.WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  return call(app, '/hooks/github', {
    method: 'POST',
    headers: {
      'x-github-event': event,
      'x-hub-signature-256': `sha256=${signature}`,
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
