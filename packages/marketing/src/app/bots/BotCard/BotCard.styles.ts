import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`group relative gap-6 rounded-lg border border-neutral-200 bg-white pt-6 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:shadow-md`;

export const Banner = tw(Typography).attrs({
  variant: 'small',
})`size-full rounded-b-lg bg-neutral-700 py-0.5 text-center text-white`;

export const ImageContainer = tw(Flex).attrs({
  alignItems: 'center',
  justifyItems: 'center',
})`size-12 min-w-12 rounded-lg`;

export const Fallback = tw(Flex).attrs({
  alignItems: 'center',
})`size-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white text-center`;

export const OrgName = tw(Typography).attrs({
  variant: 'small',
})`text-neutral-500`;

export const Description = tw(Typography).attrs({
  variant: 'small',
})`leading-relaxed text-neutral-600 min-h-10`;
