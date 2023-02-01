import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { ProviderType } from '@automa/common';

import { Flex, Typography } from 'shared';

import { useOrg } from 'orgs/hooks';

import { OrgOverviewProps } from './types';

import { Container } from './OrgOverview.styles';

const OrgOverview: React.FC<OrgOverviewProps> = ({ ...props }) => {
  const { provider, orgName } = useParams();

  const { org, loading } = useOrg(provider as ProviderType, orgName!);

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        {loading && <div>loading...</div>}
        {org && (
          <Flex direction="column" gap={2}>
            <div>{org.name}</div>
          </Flex>
        )}
        {!loading && !org && <Navigate to="/" replace />}
      </Flex>
    </Container>
  );
};

export default OrgOverview;
