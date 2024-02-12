import React from 'react';

import { Flex } from 'shared';

import { RepoOverviewProps } from './types';

import { Container } from './RepoOverview.styles';

const RepoOverview: React.FC<RepoOverviewProps> = ({ repo, ...props }) => {
  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {repo.org.name}/{repo.name}
      </Flex>
    </Container>
  );
};

export default RepoOverview;
