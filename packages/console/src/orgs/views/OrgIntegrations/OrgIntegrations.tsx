import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client';

import { IntegrationType } from '@automa/common';

import { Flex } from 'shared';

import { OrgIntegrationsProps } from './types';

import { INTEGRATIONS_QUERY } from './OrgIntegrations.queries';

const OrgIntegrations: React.FC<OrgIntegrationsProps> = ({ org }) => {
  const { data, loading } = useQuery(INTEGRATIONS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  const redirectToConnect = useCallback(
    (provider: IntegrationType) => {
      // TODO: Convert this into a function
      window.location.href = `${import.meta.env.VITE_API_URI}/api/orgs/${
        org.name
      }/integrations/${provider}`;
    },
    [org],
  );

  return (
    <>
      <Flex direction="column" alignItems="center" className="gap-2">
        {loading && !data ? (
          <div>Loading</div>
        ) : !data?.integrations?.length ? (
          <Flex justifyContent="center">No connections</Flex>
        ) : (
          data.integrations.map(({ id, name, integration_type, author }) => (
            <div key={id}>
              <div>{integration_type}</div>
              <div>{name}</div>
              <div>
                <div>Created by</div>
                <div>{author.name}</div>
              </div>
            </div>
          ))
        )}
        <button onClick={() => redirectToConnect(IntegrationType.Linear)}>
          Connect Linear
        </button>
      </Flex>
    </>
  );
};

export default OrgIntegrations;
