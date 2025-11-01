import { tw } from 'theme';

import { Typography } from 'components';

export const Container = tw.div`mx-auto max-w-3xl py-12 text-lg lg:py-16 lg:text-xl`;

export const Title = tw(Typography).attrs({
  variant: 'title2',
  align: 'center',
})`mx-auto mb-12 max-w-64 text-3xl sm:max-w-3xl md:text-4xl lg:mb-20`;
