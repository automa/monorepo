import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowsClockwise,
  CaretUpDown,
  Check,
  PlusCircle,
} from '@phosphor-icons/react';
import axios from 'axios';

import { getFragment } from 'gql';
import {
  Anchor,
  Avatar,
  Flex,
  toast,
  Typography,
  useRelativeMatch,
} from 'shared';
import DropdownMenu, {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from 'shared/components/DropdownMenu';
import { appName, getOrgAvatarUrl } from 'utils';

import { useOrg, useOrgs } from '../../hooks';

import { OrgListProps } from './types';

import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';
import { Icon, Item, Placeholder, Switcher } from './OrgList.styles';

const OrgList: React.FC<OrgListProps> = ({
  data: fullData,
  refetch,
  ...props
}) => {
  const { setOrgs } = useOrgs();
  const { org } = useOrg();

  const isDashboardView = useRelativeMatch('.');
  const isOrgView = useRelativeMatch(org?.name ?? '.', false);

  const data = getFragment(ORGS_QUERY_FRAGMENT, fullData);

  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    setOrgs(data.orgs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.orgs]);

  const sync = async () => {
    try {
      setSyncLoading(true);

      await axios.post('/api/sync');
      await refetch?.();

      toast({
        title: 'All your orgs have been synced.',
        variant: 'success',
      });
    } catch (_) {
    } finally {
      setSyncLoading(false);
    }
  };

  // Redirect to first org if on home page
  // TODO: Use local storage to remember last visited org
  if (data.orgs.length && isDashboardView) {
    return <Navigate to={data.orgs[0].name} replace />;
  }

  if (!org) {
    return null;
  }

  return (
    <Flex alignItems="center" className="gap-2" {...props}>
      <DropdownMenu
        align="start"
        trigger={
          <Switcher justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" className="gap-2">
              {isOrgView ? (
                <>
                  <Avatar
                    size="small"
                    src={getOrgAvatarUrl(org.provider_type, org.provider_id)}
                    alt={org.name}
                  />
                  {org.name}
                </>
              ) : (
                <Placeholder variant="small">Select org</Placeholder>
              )}
            </Flex>
            <Icon>
              <CaretUpDown />
            </Icon>
          </Switcher>
        }
      >
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {data.orgs.map((o) => (
          // TODO: Switch the org part of the URL only and not the whole URL
          // (can use location.pathname.replace())
          <Link key={o.id} to={o.name}>
            <Item
              $active={!!isOrgView && org.id === o.id}
              disabled={!!isOrgView && org.id === o.id}
            >
              <Flex
                fullWidth
                justifyContent="space-between"
                alignItems="center"
                className="gap-2"
              >
                <Flex alignItems="center" className="gap-2">
                  <Avatar
                    size="small"
                    src={getOrgAvatarUrl(o.provider_type, o.provider_id)}
                    alt={o.name}
                  />
                  <Typography>{o.name}</Typography>
                </Flex>
                {!!isOrgView && org.id === o.id && (
                  <Check className="font-medium" />
                )}
              </Flex>
            </Item>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <Anchor
          href={`https://github.com/apps/${appName()}/installations/select_target`}
          blank
        >
          <Item>
            <Flex alignItems="center" className="gap-2">
              <PlusCircle className="size-5" />
              <Typography variant="small">Create org</Typography>
            </Flex>
          </Item>
        </Anchor>
        <Item onSelect={sync} disabled={syncLoading}>
          <Flex alignItems="center" className="gap-2">
            <ArrowsClockwise className="size-5" />
            <Typography variant="small">
              {syncLoading ? 'Syncing ...' : 'Sync all your orgs'}
            </Typography>
          </Flex>
        </Item>
      </DropdownMenu>
    </Flex>
  );
};

export default OrgList;
