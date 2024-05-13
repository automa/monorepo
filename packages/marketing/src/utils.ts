import { join } from 'node:path';

export const contentPath = (type: string) =>
  join(process.cwd(), 'src', 'content', type);
