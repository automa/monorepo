import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { ProviderType } from '@automa/common';

import { Loader, RoutesLoader } from 'shared';

import { useOrg, useOrgs } from 'orgs/hooks';

import routes from './routes';
import { OrgProps } from './types';

import { Container, Nav, Item, Content } from './Org.styles';

const Org: React.FC<OrgProps> = ({ ...props }) => {
  const location = useLocation();

  const { provider, orgName } = useParams() as {
    provider?: ProviderType;
    orgName?: string;
  };

  const { orgsLoading } = useOrgs();
  const { org, setOrg } = useOrg();

  // Set current org from URL
  useEffect(() => {
    if (!orgsLoading && provider && orgName) {
      setOrg(provider, orgName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgsLoading, provider, orgName]);

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

  return (
    <Container {...props} asChild>
      {!org ? (
        <div>Not found</div>
      ) : (
        <>
          <NavigationMenu.Root>
            <Nav>
              {tabs.map((tab) => {
                const uri = `/${org.provider_type}/${org.name}${tab.path}`;

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
    </Container>
  );
};

export default Org;
