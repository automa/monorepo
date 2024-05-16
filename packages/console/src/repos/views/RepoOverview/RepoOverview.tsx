import React from 'react';

import { Flex } from 'shared';

import { RepoOverviewProps } from './types';

const RepoOverview: React.FC<RepoOverviewProps> = ({ repo }) => {
  return (
    <Flex direction="column" alignItems="center" className="gap-2">
      {repo.org.name}/{repo.name}
    </Flex>
  );
};

export default RepoOverview;
