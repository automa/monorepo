import React from 'react';
import { Link } from 'react-router-dom';

import { getFragment } from 'gql';
import { Flex, Typography } from 'shared';
import { useOrg } from 'orgs';
import { orgUri } from 'utils';

import { PublicBotProps } from './types';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';
import { Container, Description } from './PublicBot.styles';

const PublicBot: React.FC<PublicBotProps> = ({ publicBot: data, ...props }) => {
  const { org } = useOrg();

  const publicBot = getFragment(PUBLIC_BOT_FRAGMENT, data);

  if (!org) {
    return null;
  }

  return (
    <Link to={orgUri(org, `/bots/${publicBot.id}`)}>
      <Container {...props}>
        <Flex direction="column" className="gap-2">
          <Typography variant="large">
            {publicBot.org.name} / {publicBot.name}
          </Typography>
          <Description>{publicBot.short_description}</Description>
        </Flex>
      </Container>
    </Link>
  );
};

export default PublicBot;
