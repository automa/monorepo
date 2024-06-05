import { tw } from 'theme';

import { Typography } from 'shared';

export const Container = tw.div`w-full rounded-lg bg-white p-5 shadow-card hover:shadow-cardHover`;

export const Description = tw(Typography).attrs({
  variant: 'small',
})`text-neutral-600`;
