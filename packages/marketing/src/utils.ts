import { readFileSync } from 'fs';
import { join } from 'path';

import { evaluate } from 'next-mdx-remote-client/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import prisma from '@automa/prisma';

import { common } from 'mdx-components';

export const isBuildTime = process.env.NODE_ENV === 'production';

export const contentPath = (type: string) =>
  join(process.cwd(), 'src', 'content', type);

export const parseContent = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  path: string,
) =>
  evaluate<T>({
    source: readFileSync(path),
    components: common,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        development: !isBuildTime,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  });

export const connectToDatabase = async () => {
  const url =
    process.env.DATABASE_URL || 'postgresql://automa@localhost:5432/automa';

  const client = prisma(url);

  await client.$connect();

  return client;
};
