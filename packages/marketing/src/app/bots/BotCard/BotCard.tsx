import React from 'react';
import Image from 'next/image';

import { Anchor, Button, Flex, Tooltip, Typography } from 'components';

import Github from 'assets/logos/github.svg';

import BotBadges from '../BotBadges';

import { BotCardProps } from './types';

import {
  Banner,
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
        <Flex className="gap-4 px-6">
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
                <span className="w-full">
                  {bot.name.charAt(0).toUpperCase()}
                </span>
              </Fallback>
            )}
          </ImageContainer>

          <Flex direction="column" className="w-full gap-3">
            <Flex justifyContent="space-between" className="w-full">
              <Flex direction="column" className="gap-1">
                <Typography variant="title6">{bot.name}</Typography>
                <OrgName>by {bot.orgs.name}</OrgName>
              </Flex>
              {bot.self_hostable_repo && (
                <Tooltip body="Self-hosting documentation">
                  <Button
                    href={bot.self_hostable_repo}
                    blank
                    variant="ghost"
                    size="large"
                    icon
                  >
                    <Image src={Github} alt="GitHub" width={24} height={24} />
                  </Button>
                </Tooltip>
              )}
            </Flex>

            <Description className="mb-3">{bot.short_description}</Description>

            <BotBadges bot={bot} />
          </Flex>
        </Flex>

        <Flex direction="column" className="h-6">
          {bot.self_hostable_repo && (
            <Banner>This bot can be self-hosted</Banner>
          )}
        </Flex>
      </Container>
    </Anchor>
  );
};

export default BotCard;
