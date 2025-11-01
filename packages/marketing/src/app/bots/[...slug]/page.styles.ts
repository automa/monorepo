import { tw } from 'theme';

import { Flex } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`mx-auto w-full max-w-3xl gap-6 py-12 lg:py-16`;

export const ImageContainer = tw(Flex).attrs({
  alignItems: 'center',
  justifyItems: 'center',
})`size-20 min-w-20 rounded-2xl`;

export const Fallback = tw(Flex).attrs({
  alignItems: 'center',
})`size-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-center text-3xl font-bold text-white`;

export const Badge = tw.span`rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-2xs font-medium text-neutral-800 lg:px-3 lg:py-1 lg:text-xs`;
