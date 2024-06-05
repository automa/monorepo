import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { Flex, Tooltip, Typography } from 'shared';
import { orgUri } from 'utils';

import { useOrg } from 'orgs';

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
    <Link to={orgUri(org, `/bots/${publicBot.org.name}/${publicBot.name}`)}>
      <Container {...props}>
        <Flex direction="column" className="gap-2">
          <Flex justifyContent="space-between" className="gap-2">
            <Typography variant="large" className="break-all">
              {publicBot.org.name} / {publicBot.name}
            </Typography>
            {publicBot.installation && (
              <Tooltip body="Bot installed on this org">
                <Check height={20} width={20} className="text-green-500" />
              </Tooltip>
            )}
          </Flex>
          <Description>{publicBot.short_description}</Description>
        </Flex>
      </Container>
    </Link>
  );
};

export default PublicBot;
