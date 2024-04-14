import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client';

import { ProjectProviderType } from '@automa/common';

import { Flex } from 'shared';

import { OrgIntegrationsProps } from './types';

import { INTEGRATION_CONNECTIONS_QUERY } from './OrgIntegrations.queries';
import { Container } from './OrgIntegrations.styles';

const OrgIntegrations: React.FC<OrgIntegrationsProps> = ({ org, ...props }) => {
  const { data, loading } = useQuery(INTEGRATION_CONNECTIONS_QUERY, {
    variables: {
      provider_type: org.provider_type,
      name: org.name,
    },
  });

  const redirectToConnect = useCallback(
    (provider: ProjectProviderType) => {
      // TODO: Convert this into a function
      window.location.href = `${import.meta.env.VITE_API_URI}/api/orgs/${
        org.provider_type
      }/${org.name}/integrations/projects/${provider}`;
    },
    [org],
  );

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {loading && !data ? (
          <div>Loading</div>
        ) : !data?.org ? (
          <div>Not found</div>
        ) : (
          data.org.project_integration_connections.map(
            ({ id, name, provider_type, author }) => (
              <div key={id}>
                <div>{provider_type}</div>
                <div>{name}</div>
                <div>
                  <div>Created by</div>
                  <div>{author.name}</div>
                </div>
              </div>
            ),
          )
        )}
        <button onClick={() => redirectToConnect(ProjectProviderType.Linear)}>
          Connect Linear
        </button>
      </Flex>
    </Container>
  );
};

export default OrgIntegrations;
