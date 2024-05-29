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
        'linear',
        event,
        `${fileName}.json`,
      ),
      'utf8',
    ),
  );

  let hmac = createHmac('sha256', env.LINEAR_APP.WEBHOOK_SECRET);
  hmac = hmac.update(JSON.stringify(body));

  return call(app, '/hooks/linear', {
    method: 'POST',
    headers: {
      'Linear-Event': event,
      'Linear-Signature': hmac.digest('hex'),
    },
    payload: body,
  });
};
