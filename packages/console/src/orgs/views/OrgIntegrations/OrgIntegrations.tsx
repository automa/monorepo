import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { IntegrationType } from 'gql/graphql';
import { Flex, Loader } from 'shared';
import { objectKeys } from 'utils';

import { useApp } from 'app';
import { IntegrationConnectCard, integrations } from 'integrations';

import { OrgIntegrationsProps } from './types';

import { INTEGRATIONS_QUERY } from './OrgIntegrations.queries';

const OrgIntegrations: React.FC<OrgIntegrationsProps> = ({ org }) => {
  const { app } = useApp();

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
          [entry.type]: true,
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
        objectKeys(integrations).map(
          (integrationType) =>
            app.integrations[integrationType] && (
              <IntegrationConnectCard
                key={integrationType}
                integration={integrationType}
                connected={connectedIntegrations[integrationType]}
                config={
                  data?.integrations.find(
                    ({ type }) => type === integrationType,
                  )?.config
                }
                org={org}
              />
            ),
        )
      )}
    </Flex>
  );
};

export default OrgIntegrations;
