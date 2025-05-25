import React from 'react';
import { format } from 'date-fns';

import { parseContent } from 'utils';

import { ChangelogMatter } from '../types';
import { listChangelogs } from '../utils';

import Changelog from '../Changelog';

import { Container, Timestamp } from './page.styles';

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

  return (
    <Container>
      <Timestamp>{format(new Date(file.date), 'MMM dd, yyyy')}</Timestamp>
      <Changelog path={file.path} />
    </Container>
  );
};

export default ChangelogPage;
