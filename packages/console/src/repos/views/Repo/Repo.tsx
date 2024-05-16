import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Flex, Loader, RoutesLoader } from 'shared';

import routes from './routes';
import { RepoProps } from './types';

import { REPO_QUERY } from './Repo.queries';

const Repo: React.FC<RepoProps> = () => {
  const { orgName, repoName } = useParams() as {
    orgName: string;
    repoName: string;
  };

  const { data, loading } = useQuery(REPO_QUERY, {
    variables: {
      org_name: orgName,
      name: repoName,
    },
  });

  return (
    <Flex direction="column" alignItems="center" className="gap-2">
      {loading && !data ? (
        <div>loading...</div>
      ) : !data?.repo ? (
        <div>Not found</div>
      ) : (
        <Flex direction="column" className="gap-4">
          <div>{data.repo.name}</div>
          <RoutesLoader
            fallback={<Loader />}
            routes={routes}
            repo={data.repo}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default Repo;
