import { join } from 'path';

export const contentPath = (type: string) =>
  join(process.cwd(), 'src', 'content', type);
