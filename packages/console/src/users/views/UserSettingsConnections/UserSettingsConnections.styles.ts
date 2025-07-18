import { tw } from 'theme';

import { Flex, Typography } from 'shared';

export const Card = tw(Flex)`w-full gap-6 rounded-md bg-white p-6 shadow-card`;

export const Tag = tw(Typography).attrs({
  variant: 'small',
})`rounded-md bg-green-600 px-3 py-2 lg:text-xs text-white`;
