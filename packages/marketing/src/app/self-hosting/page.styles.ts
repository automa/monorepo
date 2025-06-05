import { tw } from 'theme';

import { Flex } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`py-12 lg:py-16 gap-12 lg:gap-16 max-w-3xl mx-auto w-full`;

export const FreeBanner = tw(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
  fullWidth: true,
})`rounded-xl bg-white border border-neutral-200 p-4 shadow-sm`;
