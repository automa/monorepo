import { tw } from 'theme';

import { Typography } from 'shared';

export const SectionTitle = tw(Typography).attrs({
  variant: 'title6',
})`-mb-2 mt-4`;

export const Label = tw(Typography)`font-semibold lg:font-semibold`;
