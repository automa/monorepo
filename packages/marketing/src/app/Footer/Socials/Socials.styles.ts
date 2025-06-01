import NextLink from 'next/link';

import { tw } from 'theme';

import { Flex } from 'components';

export const Container = tw(Flex).attrs({
  justifyContent: 'flex-end',
  justifyItems: 'center',
})`gap-3`;

export const SocialLink = tw(
  NextLink,
)`opacity-50 transition-opacity duration-200 hover:opacity-70`;
