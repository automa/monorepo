import React from 'react';
import Image from 'next/image';

import { Anchor, Flex, Typography } from 'components';

import BotBadges from '../BotBadges';

import { BotCardProps } from './types';

import {
  Container,
  Description,
  Fallback,
  ImageContainer,
  OrgName,
} from './BotCard.styles';

const BotCard: React.FC<BotCardProps> = ({ bot, ...props }) => {
  return (
    <Anchor
      href={`/bots/${bot.orgs.name.toLowerCase()}/${bot.name.toLowerCase()}`}
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

          <BotBadges bot={bot} />
        </Flex>
      </Container>
    </Anchor>
  );
};

export default BotCard;
