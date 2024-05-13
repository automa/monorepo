import { readFileSync } from 'node:fs';

import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { common } from 'mdx-components';

import { ChangelogProps } from './types';

import { Container } from './Changelog.styles';

const Changelog: React.FC<ChangelogProps> = ({ path, ...props }) => {
  return (
    <Container {...props}>
      <MDXRemote source={readFileSync(path)} components={common} />
    </Container>
  );
};

export default Changelog;
