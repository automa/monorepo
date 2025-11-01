import { tw } from 'theme';

import { Typography } from 'shared';

export const Name = tw(Typography).attrs({
  variant: 'title6',
})`w-64 text-base uppercase !leading-9 lg:text-base`;

export const Secret = tw.pre`rounded bg-neutral-100 p-2 text-sm text-neutral-700`;
