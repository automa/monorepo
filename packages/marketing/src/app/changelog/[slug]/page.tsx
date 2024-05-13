import React from 'react';

import { listChangelogs } from '../utils';
import Changelog from '../Changelog';

export const generateStaticParams = listChangelogs;

// TODO: Add metadata from frontmatter

const ChangelogPage: React.FC<{
  params: ReturnType<typeof generateStaticParams>[0];
}> = ({ params: { slug } }) => {
  const file = listChangelogs().find((p) => p.slug === slug);

  if (!file) {
    return null;
  }

  return <Changelog path={file.path} />;
};

export default ChangelogPage;
