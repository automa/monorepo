import { readdirSync } from 'fs';
import { join } from 'path';

import { contentPath } from 'utils';

export const listChangelogs = () =>
  readdirSync(contentPath('changelogs'))
    .map((name) => ({
      path: join(contentPath('changelogs'), name),
      ...(name.match(/^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>[a-z\d-]+)\.mdx$/)!
        .groups as { date: string; slug: string }),
    }))
    .reverse();
