import { LoggerOptions } from 'pino';

const development: LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
};

const production = true;

export default {
  development,
  production,
  test: false,
};
