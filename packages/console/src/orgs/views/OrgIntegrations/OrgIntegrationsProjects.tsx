import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectProviderType, ProviderType } from '@automa/common';

import { Flex } from 'shared';

import { useOrgIntegrations } from 'orgs/hooks';

import { OrgIntegrationsProps } from './types';

import { Container } from './OrgIntegrations.styles';

const OrgIntegrationsProjects: React.FC<OrgIntegrationsProps> = ({
  ...props
}) => {
  const { provider, orgName } = useParams();

  const { org, loading } = useOrgIntegrations(
    provider as ProviderType,
    orgName!,
  );

  const redirectToConnect = useCallback(
    (provider: ProjectProviderType) => {
      window.location.href = `${
        import.meta.env.VITE_API_URI
      }/api/orgs/${org?.provider_type}/${org?.name}/integrations/projects/${provider}`;
    },
    [org],
  );

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        {loading ? (
          <div>loading...</div>
        ) : (
          org && (
            <Flex direction="column" gap={2}>
              <div>{org.name}</div>
              {org.project_integration_connections.map(
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
              )}
              <button
                onClick={() => redirectToConnect(ProjectProviderType.Linear)}
              >
                Connect Linear
              </button>
            </Flex>
          )
        )}
      </Flex>
    </Container>
  );
};

export default OrgIntegrationsProjects;
