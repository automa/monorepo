import { tw } from 'theme';

import { Flex, Typography } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`w-180 gap-6 rounded-md bg-white p-6 shadow-card`;

export const Tag = tw(Typography).attrs({
  variant: 'xsmall',
})`rounded-md bg-green-600 px-3 py-2 !text-xs text-white`;
