import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Logo from 'assets/logo.svg?react';

import { Loader, RoutesLoader } from 'shared';
import { OrgList } from 'orgs';
import { UserNavbar } from 'users';

import routes from './routes';
import { DashboardProps } from './types';

import { DASHBOARD_QUERY } from './Dashboard.queries';
import { Header, Navbar } from './Dashboard.styles';

const Dashboard: React.FC<DashboardProps> = () => {
  const { data, loading, refetch } = useQuery(DASHBOARD_QUERY);

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="h-8 w-8" />
        </Link>
        {loading && !data ? (
          <div>Loading</div>
        ) : !data ? (
          <div>Error</div>
        ) : (
          <Navbar>
            <UserNavbar data={data} />
            <OrgList data={data} refetch={refetch} />
          </Navbar>
        )}
      </Header>

      <RoutesLoader fallback={<Loader />} routes={routes} />
    </>
  );
};

export default Dashboard;
