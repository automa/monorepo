import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`mx-auto max-w-5xl gap-12 pt-4`;

export const Details = tw(Flex).attrs({
  direction: 'column',
})`w-40 shrink-0 gap-8 lg:w-48`;

export const DetailsTitle = tw(Flex).attrs({
  alignItems: 'center',
})`font-bold text-neutral-600`;

export const Description = tw.div``;
