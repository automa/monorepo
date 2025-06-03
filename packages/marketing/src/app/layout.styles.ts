import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw.body`min-h-screen bg-neutral-50 font-sans text-sm font-medium text-black antialiased dark:bg-neutral-900 dark:text-white lg:text-base lg:font-normal`;

export const Header = tw(Flex).attrs({
  justifyContent: 'space-between',
})``;

export const PageContainer = tw(Flex).attrs({
  direction: 'column',
})`mx-auto w-screen max-w-7xl px-6`;

export const NavContainer = tw(Flex).attrs({
  alignItems: 'center',
})`gap-2 lg:flex-row-reverse lg:gap-6`;

export const Brand = tw(Typography)`text-2xl !font-bold lg:text-2xl`;
