import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const prisma = (url: string) =>
  new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

export default prisma;
