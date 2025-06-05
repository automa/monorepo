import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw.main`mx-auto max-w-5xl px-8`;

export const Header = tw(Typography).attrs({
  variant: 'title2',
  as: 'header',
  align: 'center',
})`my-10 lg:mt-16 lg:mb-24`;

export const Content = tw(Flex).attrs({
  direction: 'column',
})`gap-12 lg:gap-20`;

export const Timestamp = tw(
  Typography,
)`w-full lg:w-48 min-w-48 text-gray-700 font-semibold lg:font-medium mb-4 lg:mb-0 lg:mt-3 hover:underline`;
