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
        'linear',
        event,
        `${fileName}.json`,
      ),
      'utf8',
    ),
  );

  const signature = createHmac('sha256', env.LINEAR_APP.WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  return call(app, '/hooks/linear', {
    method: 'POST',
    headers: {
      'Linear-Event': event,
      'Linear-Signature': signature,
    },
    payload: body,
  });
};
