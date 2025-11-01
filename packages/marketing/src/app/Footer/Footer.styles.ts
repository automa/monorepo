import NextLink from 'next/link';

import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw.footer`mt-20 flex flex-col items-center px-2 py-20 md:mt-32 lg:mt-48`;

export const Wrapper = tw(Flex).attrs({
  direction: 'column',
  fullWidth: true,
})`max-w-5xl gap-8 md:flex-row`;

export const Brand = tw(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
})`min-w-16 md:min-w-20 md:items-start lg:min-w-36`;

export const Links = tw(Flex).attrs({
  direction: 'column',
})`flex-1 gap-8 sm:grid sm:grid-cols-2 md:mt-1 md:grid-cols-3 lg:mt-0.5`;

export const LinkGroupWrapper = tw(Flex).attrs({
  direction: 'column',
})`md:items-center`;

export const LinkGroup = tw(Flex).attrs({
  direction: 'column',
})`gap-4`;

export const LinkGroupTitle = tw(Typography).attrs({
  variant: 'small',
})`mb-1 !font-semibold`;

export const Link = tw(
  NextLink,
)`max-w-36 text-sm opacity-50 transition-opacity duration-200 hover:opacity-70`;
