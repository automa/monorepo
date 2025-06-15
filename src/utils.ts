import { readFileSync } from 'fs';
import { join } from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { common } from 'mdx-components';

export const isBuildTime = process.env.NODE_ENV === 'production';

export const contentPath = (type: string) =>
  join(process.cwd(), 'src', 'content', type);

export const parseContent = <T = unknown>(path: string) =>
  compileMDX<T>({
    source: readFileSync(path),
    components: common,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  });
