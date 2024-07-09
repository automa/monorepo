import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw.div`z-10`;

export const Content = tw(Flex).attrs({
  alignItems: 'center',
})`gap-1 w-fit rounded-lg ring-1 ring-inset ring-neutral-400 px-2 py-1 hover:ring-neutral-600 *:hover:!text-neutral-800`;
