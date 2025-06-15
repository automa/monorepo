import { tw } from 'theme';

import { Flex } from 'shared';

export const Line = tw(Flex).attrs({
  alignItems: 'flex-start',
})`gap-1 text-neutral-500`;

export const LineText = tw(Flex).attrs({
  alignItems: 'center',
  wrap: 'wrap',
})`gap-1`;

export const Subject = tw(Flex).attrs({
  alignItems: 'center',
  wrap: 'wrap',
})`gap-1 text-neutral-700 hover:text-black`;
