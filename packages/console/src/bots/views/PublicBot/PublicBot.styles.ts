import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`mx-auto max-w-5xl pt-4 gap-12`;

export const Details = tw(Flex).attrs({
  direction: 'column',
})`w-60 gap-8`;

export const DetailsTitle = tw.div`font-bold text-neutral-600`;

export const Description = tw.div`px-4`;
