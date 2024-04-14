import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { ProviderType } from '@automa/common';

import { Flex, Loader, RoutesLoader } from 'shared';

import routes from './routes';
import { OrgProps } from './types';

import { ORG_QUERY } from './Org.queries';
import { Container } from './Org.styles';

const Org: React.FC<OrgProps> = ({ ...props }) => {
  const { provider, orgName } = useParams() as {
    provider: ProviderType;
    orgName: string;
  };

  const { data, loading } = useQuery(ORG_QUERY, {
    variables: {
      provider_type: provider,
      name: orgName,
    },
  });

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {loading && !data ? (
          <div>loading...</div>
        ) : !data?.org ? (
          <div>Not found</div>
        ) : (
          <Flex direction="column" className="gap-4">
            <div>{data.org.name}</div>
            <RoutesLoader
              fallback={<Loader />}
              routes={routes}
              org={data.org}
            />
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default Org;
