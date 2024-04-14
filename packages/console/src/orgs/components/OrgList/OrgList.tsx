import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowsClockwise,
  CaretUpDown,
  Check,
  PlusCircle,
} from '@phosphor-icons/react';
import axios from 'axios';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Flex,
  Typography,
} from 'shared';
import { getFragment } from 'gql';

import { getOrgAvatarUrl } from 'orgs/utils';

import { OrgListProps } from './types';

import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';
import { Container, Switcher, Icon, Item } from './OrgList.styles';

const OrgList: React.FC<OrgListProps> = ({
  data: fullData,
  refetch,
  ...props
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = getFragment(ORGS_QUERY_FRAGMENT, fullData);

  const sync = async () => {
    try {
      await axios.post('/api/sync');
      await refetch?.();
      // TODO: Show success toast
    } catch (_) {}
  };

  // Redirect to first org if on home page
  useEffect(() => {
    if (data.orgs.length && location.pathname === '/') {
      navigate(`/${data.orgs[0].provider_type}/${data.orgs[0].name}`);
    }
  }, [location, data, navigate]);

  // Get the current org from the URL
  const currentOrg = useMemo(
    () =>
      data.orgs.find((org) =>
        location.pathname.startsWith(`/${org.provider_type}/${org.name}`),
      ),
    [location, data],
  );

  useEffect(() => {
    if (currentOrg) {
      // TODO: Set user.org_id to current org
    }
  }, [currentOrg]);

  // Don't show org list on non-org pages
  if (!currentOrg) {
    return null;
  }

  return (
    <Container {...props} asChild>
      <DropdownMenu
        align="start"
        trigger={
          <Switcher justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" className="gap-2">
              <Avatar
                size="small"
                src={getOrgAvatarUrl(
                  currentOrg.provider_type,
                  currentOrg.provider_id,
                )}
                alt={currentOrg.name}
              />
              {currentOrg.name}
            </Flex>
            <Icon>
              <CaretUpDown />
            </Icon>
          </Switcher>
        }
      >
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {data.orgs.map((org) => (
          <Link key={org.id} to={`/${org.provider_type}/${org.name}`}>
            <Item
              $active={currentOrg.id === org.id}
              disabled={currentOrg.id === org.id}
            >
              <Flex
                fullWidth
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex alignItems="center" className="gap-2">
                  <Avatar
                    size="small"
                    src={getOrgAvatarUrl(org.provider_type, org.provider_id)}
                    alt={org.name}
                  />
                  {org.name}
                </Flex>
                {currentOrg.id === org.id && <Check className="font-medium" />}
              </Flex>
            </Item>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <a
          href="https://github.com/apps/automa/installations/select_target"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Item>
            <Flex alignItems="center" className="gap-2">
              <PlusCircle height={20} width={20} />
              <Typography variant="small">Create org</Typography>
            </Flex>
          </Item>
        </a>
        <Item onSelect={sync}>
          <Flex alignItems="center" className="gap-2">
            <ArrowsClockwise height={20} width={20} />
            <Typography variant="small">Sync all your orgs</Typography>
          </Flex>
        </Item>
      </DropdownMenu>
    </Container>
  );
};

export default OrgList;
