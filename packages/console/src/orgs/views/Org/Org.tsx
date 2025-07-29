import React, { Suspense, useEffect, useMemo } from 'react';
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { useAnalytics } from 'analytics';
import { Flex, Loader, Typography } from 'shared';
import { useRelativeMatch } from 'shared/hooks';

import { useAuth } from 'auth';
import { EmptyTopNav, useOrg, useOrgs } from 'orgs';

import BotOnboarding from 'bots/components/BotOnboarding';
import RepoOnboarding from 'repos/components/RepoOnboarding';

import { Content, Item, Nav } from './Org.styles';

const Org: React.FC = () => {
  const { orgName } = useParams() as {
    orgName: string;
  };

  const location = useLocation();

  const navigate = useNavigate();

  const { page } = useAnalytics();

  const isOrgIndexView = useRelativeMatch('.');
  const isOrgTasksView = useRelativeMatch('tasks', false);
  const isOrgReposView = useRelativeMatch('repos', false);

  const { setUserOrg } = useAuth();

  const { orgs, orgsLoading } = useOrgs();
  const { org, setOrg } = useOrg();

  // Set current org from URL
  useEffect(() => {
    if (!orgsLoading && orgs && orgName) {
      if (orgName !== '$') {
        setOrg(orgName);
        return;
      }

      // Helper to deep link while ignoring the org name in the URL
      page('Convenience', 'Deep Link', {
        path: location.pathname,
        url: `${window.location.origin}${location.pathname}`,
      });

      // TODO: Either store the last visited org in local storage and read it
      // or ask the user to select an org if they have access to multiple
      const toOrg = org || orgs[0];
      const to = location.pathname.replace('$', `${toOrg.name}`);

      navigate(to, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgs, orgsLoading, org, orgName]);

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
    return (
      <>
        <Loader />
        <Navigate to={tabs[0].path} replace />
      </>
    );
  }

  return (
    <>
      {!org ? (
        <>
          <EmptyTopNav />
          <Content>
            <Flex justifyContent="center">Not found</Flex>
          </Content>
        </>
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
              <Suspense fallback={<Loader />}>
                <Outlet context={{ org }} />
              </Suspense>
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default Org;
