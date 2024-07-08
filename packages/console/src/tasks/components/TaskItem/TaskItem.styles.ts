import { tw } from 'theme';

import { Flex } from 'shared';

export const Line = tw(Flex).attrs({
  alignItems: 'center',
})`gap-1 text-neutral-500`;

export const LineIcon = tw.div`mr-1 size-4`;

export const Subject = tw(Flex).attrs({
  alignItems: 'center',
})`gap-1 text-neutral-800 hover:text-black`;
