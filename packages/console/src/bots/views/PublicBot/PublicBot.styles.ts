import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`mx-auto max-w-5xl pt-4 gap-12`;

export const Details = tw(Flex).attrs({
  direction: 'column',
})`lg:w-60 w-48 gap-8 shrink-0`;

export const DetailsTitle = tw(Flex).attrs({
  alignItems: 'center',
})`font-bold text-neutral-600`;

export const Description = tw.div``;
