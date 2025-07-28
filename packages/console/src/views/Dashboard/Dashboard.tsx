import React, { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { NetworkStatus, useQuery } from '@apollo/client';

import { useGateValue } from 'optimizer';
import { Flex, Loader, Typography, useRelativeMatch } from 'shared';

import { useApp } from 'app';
import { EmptyTopNav, OrgList } from 'orgs';
import { UserNavbar } from 'users';

import Logo from 'assets/logo.svg?react';

import { DASHBOARD_QUERY } from './Dashboard.queries';
import { Header } from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const { app } = useApp();

  const isAbleToAccess = useGateValue('access');

  const isDashboardView = useRelativeMatch('.');

  const { data, loading, refetch, networkStatus } = useQuery(DASHBOARD_QUERY);

  if (app.cloud && !isAbleToAccess) {
    return (
      <Flex alignItems="center" direction="column" className="mt-40 gap-4">
        <Typography variant="title5" className="text-center">
          Successfully joined the waitlist!
        </Typography>
        <Typography>
          We will notify you via email when cloud is available.
        </Typography>
      </Flex>
    );
  }

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
        <Suspense
          fallback={
            <>
              <EmptyTopNav />
              <Loader />
            </>
          }
        >
          <Outlet />
        </Suspense>
      )}
    </>
  );
};

export default Dashboard;
