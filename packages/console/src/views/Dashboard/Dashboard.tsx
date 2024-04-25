import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Logo from 'assets/logo.svg?react';

import { Flex, Loader, RoutesLoader } from 'shared';
import { OrgList } from 'orgs';
import { UserNavbar } from 'users';

import routes from './routes';
import { DashboardProps } from './types';

import { DASHBOARD_QUERY } from './Dashboard.queries';
import { Header } from './Dashboard.styles';

const Dashboard: React.FC<DashboardProps> = () => {
  const { data, loading, refetch } = useQuery(DASHBOARD_QUERY);

  return (
    <>
      <Header element="header" alignItems="center">
        <Link to="/">
          <Logo className="h-8 w-8" />
        </Link>
        {loading && !data ? (
          <div>Loading</div>
        ) : !data ? (
          <div>Error</div>
        ) : (
          <Flex
            element="nav"
            direction="row-reverse"
            justifyContent="space-between"
            fullWidth
          >
            <UserNavbar data={data} />
            <OrgList data={data} refetch={refetch} />
          </Flex>
        )}
      </Header>
      <RoutesLoader fallback={<Loader />} routes={routes} />
    </>
  );
};

export default Dashboard;
