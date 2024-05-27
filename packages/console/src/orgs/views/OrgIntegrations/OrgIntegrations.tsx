import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { IntegrationType } from '@automa/common';

import { Flex, Loader } from 'shared';
import { integrations, IntegrationConnectCard } from 'integrations';
import { objectKeys } from 'utils';

import { OrgIntegrationsProps } from './types';

import { INTEGRATIONS_QUERY } from './OrgIntegrations.queries';

const OrgIntegrations: React.FC<OrgIntegrationsProps> = ({ org }) => {
  const { data, loading } = useQuery(INTEGRATIONS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  const connectedIntegrations = useMemo(
    () =>
      (data?.integrations || []).reduce(
        (acc, entry) => ({
          ...acc,
          [entry.integration_type]: true,
        }),
        {
          [IntegrationType.Github]: org.has_installation,
        } as Record<IntegrationType, boolean>,
      ),
    [org.has_installation, data?.integrations],
  );

  return (
    <Flex direction="column" alignItems="center" className="gap-8 pt-8">
      {loading && !data ? (
        <Loader />
      ) : (
        objectKeys(integrations).map((integrationType) => (
          <IntegrationConnectCard
            key={integrationType}
            integration={integrationType}
            connected={connectedIntegrations[integrationType]}
            org={org}
          />
        ))
      )}
    </Flex>
  );
};

export default OrgIntegrations;
