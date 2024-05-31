import { tw } from 'theme';

import { Flex, Typography } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`mx-auto max-w-5xl pt-4 gap-12`;

export const Details = tw(Flex).attrs({
  direction: 'column',
})`w-60`;

export const DetailsTitle = tw(Typography)`pb-2 font-bold text-neutral-700`;

export const Description = tw.div`px-4`;
