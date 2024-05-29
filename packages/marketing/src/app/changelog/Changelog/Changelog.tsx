import React from 'react';

import { Typography } from 'components';
import { parseContent } from 'utils';

import { ChangelogMatter } from '../types';

import { ChangelogProps } from './types';

import { Container } from './Changelog.styles';

const Changelog: React.FC<ChangelogProps> = async ({ path, ...props }) => {
  const { content, frontmatter } = await parseContent<ChangelogMatter>(path);

  return (
    <Container {...props}>
      <Typography variant="title3">{frontmatter.title}</Typography>
      {content}
    </Container>
  );
};

export default Changelog;
