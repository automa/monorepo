import { tw } from 'theme';

import { Flex } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`gap-12 py-12 lg:gap-16 lg:py-16`;

export const List = tw.div`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3`;
