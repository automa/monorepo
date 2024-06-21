import React from 'react';

import { parseContent } from 'utils';

import { ChangelogMatter } from '../types';
import { listChangelogs } from '../utils';

import Changelog from '../Changelog';

export const generateStaticParams = listChangelogs;

type Props = {
  params: ReturnType<typeof generateStaticParams>[0];
};

export const generateMetadata = async ({ params: { slug } }: Props) => {
  const file = listChangelogs().find((p) => p.slug === slug);

  if (!file) {
    return null;
  }

  const { frontmatter } = await parseContent<ChangelogMatter>(file.path);

  return {
    title: `${frontmatter.title} ‒ Automa`,
    description: frontmatter.description,
  };
};

const ChangelogPage: React.FC<Props> = ({ params: { slug } }) => {
  const file = listChangelogs().find((p) => p.slug === slug);

  if (!file) {
    return null;
  }

  return <Changelog path={file.path} />;
};

export default ChangelogPage;
