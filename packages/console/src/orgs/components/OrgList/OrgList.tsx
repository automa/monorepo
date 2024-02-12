import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Flex, Typography } from 'shared';
import { getFragment } from 'gql';

import { OrgListProps } from './types';

import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';
import { Container } from './OrgList.styles';

const OrgList: React.FC<OrgListProps> = ({ data: fullData, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = getFragment(ORGS_QUERY_FRAGMENT, fullData);

  useEffect(() => {
    if (data.orgs.length && location.pathname === '/') {
      navigate(`/${data.orgs[0].provider_type}/${data.orgs[0].name}`);
    }
  }, [location, data, navigate]);

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {data.orgs.map((org) => (
          <Typography
            key={org.id}
            onClick={() => navigate(`/${org.provider_type}/${org.name}`)}
            link
          >
            {org.name}
          </Typography>
        ))}
      </Flex>
    </Container>
  );
};

export default OrgList;
