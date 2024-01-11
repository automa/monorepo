import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { ProviderType } from '@automa/common';

import { Flex, Loader, RoutesLoader } from 'shared';

import routes from './routes';
import { RepoProps } from './types';

import { REPO_QUERY } from './Repo.queries';
import { Container } from './Repo.styles';

const Repo: React.FC<RepoProps> = ({ ...props }) => {
  const { provider, orgName, repoName } = useParams() as {
    provider: ProviderType;
    orgName: string;
    repoName: string;
  };

  const { data, loading } = useQuery(REPO_QUERY, {
    variables: {
      provider_type: provider,
      org_name: orgName,
      name: repoName,
    },
  });

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        {loading && !data ? (
          <div>loading...</div>
        ) : !data?.repo ? (
          <div>Not found</div>
        ) : (
          <Flex direction="column" gap={2}>
            <div>{data.repo.name}</div>
            <RoutesLoader
              fallback={<Loader />}
              routes={routes}
              repo={data.repo}
            />
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default Repo;
