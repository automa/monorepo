import React from 'react';
import Image from 'next/image';

import { Anchor, Flex, Typography } from 'components';

import AgentBadges from '../AgentBadges';

import { AgentCardProps } from './types';

import {
  Container,
  Description,
  Fallback,
  ImageContainer,
  OrgName,
} from './AgentCard.styles';

const AgentCard: React.FC<AgentCardProps> = ({ bot, ...props }) => {
  return (
    <Anchor
      href={`/agents/${bot.orgs.name.toLowerCase()}/${bot.name.toLowerCase()}`}
    >
      <Container {...props}>
        <ImageContainer>
          {bot.image_url ? (
            <Image
              src={bot.image_url}
              alt={`${bot.name} logo`}
              width={48}
              height={48}
              className="rounded-lg"
            />
          ) : (
            <Fallback>
              <span className="w-full">{bot.name.charAt(0).toUpperCase()}</span>
            </Fallback>
          )}
        </ImageContainer>

        <Flex direction="column" className="gap-3">
          <Flex direction="column" className="gap-1">
            <Typography variant="title6">{bot.name}</Typography>
            <OrgName>by {bot.orgs.name}</OrgName>
          </Flex>

          <Description className="mb-3">{bot.short_description}</Description>

          <AgentBadges bot={bot} />
        </Flex>
      </Container>
    </Anchor>
  );
};

export default AgentCard;
