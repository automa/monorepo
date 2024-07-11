import React, { useEffect, useMemo } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import {
  Flex,
  Loader,
  RoutesLoader,
  Typography,
  useRelativeMatch,
} from 'shared';

import { useAuth } from 'auth';
import { BotOnboarding } from 'bots';
import { useOrg, useOrgs } from 'orgs';
import { RepoOnboarding } from 'repos';

import routes from './routes';
import { OrgProps } from './types';

import { Content, Item, Nav } from './Org.styles';

const Org: React.FC<OrgProps> = () => {
  const { orgName } = useParams() as {
    orgName: string;
  };

  const isOrgIndexView = useRelativeMatch('.');
  const isOrgTasksView = useRelativeMatch('tasks');
  const isOrgReposView = useRelativeMatch('repos');

  const { setUserOrg } = useAuth();

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
      setUserOrg(org.id);
    }
  }, [org, setUserOrg]);

  const tabs = useMemo(() => {
    if (!org) return [];

    return [
      {
        name: 'Tasks',
        path: 'tasks',
      },
      {
        name: 'Repositories',
        path: 'repos',
      },
      {
        name: 'Bots',
        path: 'bots',
      },
      {
        name: 'Integrations',
        path: 'integrations',
      },
      {
        name: 'Insights',
        path: 'insights',
      },
      {
        name: 'Settings',
        path: 'settings',
      },
    ];
  }, [org]);

  const shouldShowRepoOnboarding = useMemo(
    () => org && !org.has_installation && (isOrgTasksView || isOrgReposView),
    [org, isOrgTasksView, isOrgReposView],
  );

  const shouldShowBotOnboarding = useMemo(
    () => org && !org.bot_installations_count && isOrgTasksView,
    [org, isOrgTasksView],
  );

  // Redirect to first tab if on org page
  if (org && isOrgIndexView) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <>
      {!org ? (
        <Content>
          <Flex justifyContent="center">Not found</Flex>
        </Content>
      ) : (
        <>
          <NavigationMenu.Root>
            <Nav>
              {tabs.map((tab) => (
                <NavLink key={tab.name} to={tab.path}>
                  {({ isActive }) => (
                    <Item $active={isActive}>
                      <Typography variant="small">{tab.name}</Typography>
                    </Item>
                  )}
                </NavLink>
              ))}
            </Nav>
          </NavigationMenu.Root>
          <Content>
            {shouldShowRepoOnboarding ? (
              <RepoOnboarding org={org} />
            ) : shouldShowBotOnboarding ? (
              <BotOnboarding org={org} />
            ) : (
              <RoutesLoader fallback={<Loader />} routes={routes} org={org} />
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default Org;
