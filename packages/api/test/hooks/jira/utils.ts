import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { FastifyInstance } from 'fastify';

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
        'jira',
        event,
        `${fileName}.json`,
      ),
      'utf8',
    ),
  );

  return call(app, '/hooks/jira', {
    method: 'POST',
    payload: body,
  });
};
