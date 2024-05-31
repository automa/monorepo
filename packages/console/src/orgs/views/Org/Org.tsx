import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Loader, RoutesLoader } from 'shared';
import { orgUri } from 'utils';

import { useOrg, useOrgs } from 'orgs/hooks';

import routes from './routes';
import { OrgProps } from './types';

import { Nav, Item, Content } from './Org.styles';

const Org: React.FC<OrgProps> = () => {
  const { orgName } = useParams() as {
    orgName?: string;
  };

  const location = useLocation();

  const { orgsLoading } = useOrgs();
  const { org, setOrg } = useOrg();

  // Set current org from URL
  useEffect(() => {
    if (!orgsLoading && orgName) {
      setOrg(orgName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgsLoading, orgName]);

  // Set user.org_id to current org
  useEffect(() => {
    if (org) {
      // TODO: Set user.org_id to current org
    }
  }, [org]);

  const tabs = useMemo(() => {
    if (!org) return [];

    return [
      {
        name: 'Tasks',
        path: '/tasks',
      },
      {
        name: 'Repositories',
        path: '/repos',
      },
      {
        name: 'Bots',
        path: '/bots',
      },
      {
        name: 'Integrations',
        path: '/integrations',
      },
      {
        name: 'Insights',
        path: '/insights',
      },
      {
        name: 'Settings',
        path: '/settings',
      },
    ];
  }, [org]);

  // Redirect to first tab if on org page
  if (org && location.pathname === orgUri(org)) {
    return <Navigate to={orgUri(org, tabs[0].path)} replace />;
  }

  return (
    <>
      {!org ? (
        <div>Not found</div>
      ) : (
        <>
          <NavigationMenu.Root>
            <Nav>
              {tabs.map((tab) => {
                const uri = orgUri(org, tab.path);

                return (
                  <Item
                    key={tab.name}
                    $active={location.pathname.startsWith(uri)}
                    asChild
                  >
                    <Link to={uri}>{tab.name}</Link>
                  </Item>
                );
              })}
            </Nav>
          </NavigationMenu.Root>
          <Content>
            <RoutesLoader fallback={<Loader />} routes={routes} org={org} />
          </Content>
        </>
      )}
    </>
  );
};

export default Org;
