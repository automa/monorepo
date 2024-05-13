import { tw } from 'theme';

import { Typography } from 'components';

export const Container = tw.div`mx-auto max-w-3xl py-6 text-lg md:py-12 lg:py-16 lg:text-xl`;

export const Title = tw(Typography).attrs({
  variant: 'title3',
})`pb-6 font-semibold`;
