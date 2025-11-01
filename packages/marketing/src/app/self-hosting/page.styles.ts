import { tw } from 'theme';

import { Flex } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`mx-auto w-full max-w-3xl gap-12 py-12 lg:gap-16 lg:py-16`;

export const FreeBanner = tw(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
  fullWidth: true,
})`rounded-xl border border-neutral-200 bg-white p-4 shadow-sm`;
