import React from 'react';

import { getFragment } from 'gql';
import { Flex, Typography } from 'shared';

import { PublicBotProps } from './types';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';
import { Container, Description } from './PublicBot.styles';

const PublicBot: React.FC<PublicBotProps> = ({ publicBot: data, ...props }) => {
  const publicBot = getFragment(PUBLIC_BOT_FRAGMENT, data);

  return (
    <Container {...props}>
      <Flex direction="column" className="gap-2">
        <Typography variant="large">
          {publicBot.org.name} / {publicBot.name}
        </Typography>
        <Description>{publicBot.short_description}</Description>
      </Flex>
    </Container>
  );
};

export default PublicBot;
