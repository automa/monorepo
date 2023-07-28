import { InjectOptions } from 'fastify';

import { server } from '../src';

// Import the modules to use their typings
import '../src/plugins/analytics';
import '../src/plugins/auth';
import '../src/plugins/error';
import '../src/plugins/optimizer';
import '../src/plugins/prisma';
import '../src/plugins/redis';

export const call = async (
  uri: string,
  options?: Omit<InjectOptions, 'url' | 'path' | 'server' | 'Request'>,
) => {
  const app = await server();

  const response = await app.inject({
    url: uri,
    ...options,
  });

  await app.close();

  return response;
};
