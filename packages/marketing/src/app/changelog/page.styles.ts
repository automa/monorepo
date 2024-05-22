import { tw } from 'theme';

import { Typography } from 'components';

export const Container = tw.main``;

export const Header = tw(Typography).attrs({
  variant: 'title2',
  as: 'header',
  className: 'my-10 lg:my-16 lg:ml-48',
})``;

export const Timestamp = tw(
  Typography,
)`w-full lg:w-48 min-w-48 text-gray-700 mb-4 lg:mb-0 lg:mt-1 hover:underline`;
