import { tw } from 'theme';

import { Typography } from 'components';

export const Container = tw.div`mx-auto max-w-3xl py-6 text-lg md:py-12 lg:py-16 lg:text-xl`;

export const Title = tw(Typography).attrs({
  variant: 'title2',
  align: 'center',
})`text-3xl md:text-4xl max-w-64 sm:max-w-3xl mb-12 lg:mb-20 mx-auto`;
