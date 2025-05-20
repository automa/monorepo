import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Loader, Typography } from 'shared';

import { IntegrationSetupGithubProps } from './types';

import { INTEGRATION_SETUP_GITHUB_QUERY } from './IntegrationSetupGithub.queries';
import { Container } from './IntegrationSetupGithub.styles';

const IntegrationSetupGithub: React.FC<IntegrationSetupGithubProps> = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const installationId = searchParams.get('installation_id');

  const { data } = useQuery(INTEGRATION_SETUP_GITHUB_QUERY, {
    pollInterval: 1000,
    skip: !installationId,
  });

  useEffect(() => {
    if (!installationId || !data) {
      return;
    }

    const org = data.orgs.find(
      (org) => org.github_installation_id?.toString() === installationId,
    );

    if (!org) {
      return;
    }

    navigate(`/${org.name}`);
  }, [installationId, data, navigate]);

  return (
    <Container>
      <Typography variant="title6">Waiting for github ...</Typography>
      <Loader />
    </Container>
  );
};

export default IntegrationSetupGithub;
