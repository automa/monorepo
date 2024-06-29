import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Robot } from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { Badge, Flex, Tooltip, Typography } from 'shared';

import { PublicBotProps } from './types';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';
import { Container } from './PublicBot.styles';

const PublicBot: React.FC<PublicBotProps> = ({ publicBot: data, ...props }) => {
  const publicBot = getFragment(PUBLIC_BOT_FRAGMENT, data);

  return (
    <Link to={`../bots/${publicBot.org.name}/${publicBot.name}`}>
      <Container {...props}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" className="gap-4">
            {publicBot.image_url ? (
              <img
                src={publicBot.image_url}
                alt={publicBot.name}
                className="size-16"
              />
            ) : (
              <Robot className="size-16 text-neutral-400" />
            )}
            <Flex direction="column" className="gap-2">
              <Flex alignItems="center" className="gap-2">
                <Typography variant="large" className="break-all">
                  {publicBot.org.name} / {publicBot.name}
                </Typography>
                {!publicBot.is_published && (
                  <Badge variant="warning">Private</Badge>
                )}
                {publicBot.is_preview && <Badge variant="success">Beta</Badge>}
                <Badge variant="tag">
                  {publicBot.is_deterministic ? 'Deterministic' : 'Uses AI'}
                </Badge>
              </Flex>
              <Typography variant="small" className="text-neutral-600">
                {publicBot.short_description}
              </Typography>
            </Flex>
          </Flex>
          {publicBot.installation && (
            <Tooltip body="Bot installed on this org">
              <Check className="size-5 text-green-500" />
            </Tooltip>
          )}
        </Flex>
      </Container>
    </Link>
  );
};

export default PublicBot;
