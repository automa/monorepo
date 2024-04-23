import React, { useEffect } from 'react';
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
import { useOrg, useOrgs } from 'orgs/hooks';

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

  const { setOrgs } = useOrgs();
  const { org } = useOrg();

  const data = getFragment(ORGS_QUERY_FRAGMENT, fullData);

  // Redirect to first org if on home page
  useEffect(() => {
    if (data.orgs.length && location.pathname === '/') {
      navigate(`/${data.orgs[0].provider_type}/${data.orgs[0].name}/repos`);
    }
  }, [location, data, navigate]);

  useEffect(() => {
    setOrgs(data.orgs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.orgs]);

  const sync = async () => {
    try {
      await axios.post('/api/sync');
      await refetch?.();
      // TODO: Show success toast
    } catch (_) {}
  };

  if (!org) {
    return null;
  }

  // Don't show org list on non-org pages
  if (!location.pathname.startsWith(`/${org.provider_type}/${org.name}`)) {
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
                src={getOrgAvatarUrl(org.provider_type, org.provider_id)}
                alt={org.name}
              />
              {org.name}
            </Flex>
            <Icon>
              <CaretUpDown />
            </Icon>
          </Switcher>
        }
      >
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {data.orgs.map((o) => (
          <Link key={o.id} to={`/${o.provider_type}/${o.name}`}>
            <Item $active={org.id === o.id} disabled={org.id === o.id}>
              <Flex
                fullWidth
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex alignItems="center" className="gap-2">
                  <Avatar
                    size="small"
                    src={getOrgAvatarUrl(o.provider_type, o.provider_id)}
                    alt={o.name}
                  />
                  {o.name}
                </Flex>
                {org.id === o.id && <Check className="font-medium" />}
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
