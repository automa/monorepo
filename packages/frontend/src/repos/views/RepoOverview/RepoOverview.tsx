import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProviderType } from '@automa/common';

import { Flex, Typography } from 'shared';

import { useRepo } from 'repos/hooks';

import { RepoOverviewProps } from './types';

import { Container } from './RepoOverview.styles';

const RepoOverview: React.FC<RepoOverviewProps> = ({ ...props }) => {
  const { provider, orgName, repoName } = useParams();

  const navigate = useNavigate();

  const { repo, loading } = useRepo(
    provider as ProviderType,
    orgName!,
    repoName!,
  );

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        {loading ? (
          <div>loading...</div>
        ) : (
          repo && (
            <Flex direction="column" gap={2}>
              <div>
                {repo.org.name}/{repo.name}
              </div>
            </Flex>
          )
        )}
      </Flex>
    </Container>
  );
};

export default RepoOverview;
