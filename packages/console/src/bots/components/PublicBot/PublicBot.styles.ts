import { tw } from 'theme';

import { Typography } from 'shared';

export const Container = tw.div`size-full rounded-lg bg-white p-5 shadow-card hover:shadow-cardHover`;

export const Description = tw(Typography).attrs({
  variant: 'small',
})`text-neutral-600`;
