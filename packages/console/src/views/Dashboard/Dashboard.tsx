import React from 'react';
import { Link } from 'react-router-dom';
import { NetworkStatus, useQuery } from '@apollo/client';

import { Flex, Loader, RoutesLoader, useRelativeMatch } from 'shared';

import Logo from 'assets/logo.svg?react';

import { EmptyTopNav, OrgList } from 'orgs/components';
import { UserNavbar } from 'users/components';

import routes from './routes';
import { DashboardProps } from './types';

import { DASHBOARD_QUERY } from './Dashboard.queries';
import { Header } from './Dashboard.styles';

const Dashboard: React.FC<DashboardProps> = () => {
  const isDashboardView = useRelativeMatch('.');

  const { data, loading, refetch, networkStatus } = useQuery(DASHBOARD_QUERY);

  return (
    <>
      <Header element="header" alignItems="center">
        <Link to="/">
          <Logo className="size-8" />
        </Link>
        {loading && !data ? (
          <></>
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
      {(isDashboardView ||
        (loading && networkStatus === NetworkStatus.loading)) && (
        <>
          <EmptyTopNav />
          <Loader />
        </>
      )}
      {data && (
        <RoutesLoader
          fallback={
            <>
              <EmptyTopNav />
              <Loader />
            </>
          }
          routes={routes}
        />
      )}
    </>
  );
};

export default Dashboard;
