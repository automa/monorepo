import React from 'react';
import axios from 'axios';
import { useQuery } from '@apollo/client';

import { Flex, Link, Loader, RoutesLoader, Typography } from 'shared';
import { OrgList } from 'orgs';
import { UserNavbar } from 'users';

import routes from './routes';
import { DashboardProps } from './types';

import { DASHBOARD_QUERY } from './Dashboard.queries';
import { Container } from './Dashboard.styles';

const Dashboard: React.FC<DashboardProps> = () => {
  const { data, loading, refetch } = useQuery(DASHBOARD_QUERY);

  const sync = async () => {
    try {
      await axios.post('/api/sync');
      await refetch();
    } catch (_) {}
  };

  return (
    <Container>
      <Link to="/">Home</Link>
      {loading && !data ? (
        <div>Loading</div>
      ) : !data ? (
        <div>Error</div>
      ) : (
        <Flex direction="column" className="gap-2">
          <Typography onClick={sync} link>
            Sync
          </Typography>
          <OrgList data={data} />
          <UserNavbar data={data} />
          <RoutesLoader fallback={<Loader />} routes={routes} />
        </Flex>
      )}
    </Container>
  );
};

export default Dashboard;
