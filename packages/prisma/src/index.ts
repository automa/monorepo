import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const prisma = (isProduction: boolean, url: string) =>
  new PrismaClient({
    log: isProduction ? [] : ['query'],
    datasources: {
      db: {
        url,
      },
    },
  });

export default prisma;
