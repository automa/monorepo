import { tw } from 'theme';

import { Typography } from 'shared';

export const Name = tw(Typography).attrs({
  variant: 'title6',
})`uppercase w-64 !leading-9 text-base lg:text-base`;

export const Secret = tw.pre`rounded bg-neutral-100 p-2 text-sm text-neutral-700`;
