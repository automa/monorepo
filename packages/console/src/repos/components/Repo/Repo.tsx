import React from 'react';

import { getFragment } from 'gql';

import { RepoProps } from './types';

import { REPO_FRAGMENT } from './Repo.queries';
import { Container } from './Repo.styles';

const Repo: React.FC<RepoProps> = ({ repo: data, ...props }) => {
  const repo = getFragment(REPO_FRAGMENT, data);

  // TODO: Link to `../${repo.name}`
  return (
    <Container {...props} asChild>
      <div>{repo.name}</div>
    </Container>
  );
};

export default Repo;
