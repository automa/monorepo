import { tw } from 'theme';

import { Typography } from 'shared';

export const Banner = tw(Typography).attrs({
  align: 'center',
})`mx-2 mb-8 rounded-md bg-neutral-200 p-2`;
