import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw.div`z-10`;

export const Content = tw(Flex).attrs({
  alignItems: 'center',
})`gap-1 rounded-lg border border-neutral-400 px-2 py-1 hover:border-neutral-700 *:hover:!text-neutral-800`;
