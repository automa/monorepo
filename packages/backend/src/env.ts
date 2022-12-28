export const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    COOKIE_SECRET: {
      type: 'string',
      default: 'thisismycoupdetathandsupupgethigh',
    },
    CORS_ORIGIN: {
      type: 'string',
      default: '*',
    },
    PORT: {
      type: 'string',
      default: 3000,
    },
  },
};

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      COOKIE_SECRET: string;
      CORS_ORIGIN: string;
      PORT: string;
    };
  }
}
