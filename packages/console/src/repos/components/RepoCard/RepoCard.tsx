import React from 'react';

import { getFragment } from 'gql';

import { RepoCardProps } from './types';

import { REPO_FRAGMENT } from './RepoCard.queries';
import { Container } from './RepoCard.styles';

const RepoCard: React.FC<RepoCardProps> = ({ repo: data, ...props }) => {
  const repo = getFragment(REPO_FRAGMENT, data);

  // TODO: Link to orgUri(org, `/${repo.name}`)
  return (
    <Container {...props} asChild>
      <div>{repo.name}</div>
    </Container>
  );
};

export default RepoCard;
