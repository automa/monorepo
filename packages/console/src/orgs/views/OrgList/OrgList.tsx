import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Flex, Typography } from 'shared';

import { useOrgs } from 'orgs/hooks';

import { OrgListProps } from './types';

import { Container } from './OrgList.styles';

const OrgList: React.FC<OrgListProps> = ({ ...props }) => {
  const navigate = useNavigate();

  const { orgs, loading, refetch } = useOrgs();

  const sync = async () => {
    try {
      await axios.post('/api/sync');
      await refetch();
    } catch (_) {}
  };

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        <Flex paddingBottom={2}>Dashboard</Flex>
        {loading ? (
          <div>Loading...</div>
        ) : (
          orgs && (
            <Flex direction="column" gap={1}>
              <Typography onClick={sync} link>
                Sync
              </Typography>
              {orgs.map((org) => (
                <Typography
                  key={org.id}
                  onClick={() => navigate(`/orgs/github/${org.name}`)}
                  link
                >
                  {org.name}
                </Typography>
              ))}
            </Flex>
          )
        )}
      </Flex>
    </Container>
  );
};

export default OrgList;
