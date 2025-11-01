import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw.main`mx-auto max-w-5xl px-8`;

export const Header = tw(Typography).attrs({
  variant: 'title2',
  as: 'header',
  align: 'center',
})`my-10 lg:mb-24 lg:mt-16`;

export const Content = tw(Flex).attrs({
  direction: 'column',
})`gap-12 lg:gap-20`;

export const Timestamp = tw(
  Typography,
)`mb-4 w-full min-w-48 font-semibold text-gray-700 hover:underline lg:mb-0 lg:mt-3 lg:w-48 lg:font-medium`;
