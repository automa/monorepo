import { tw } from 'theme';

import { Flex } from 'shared';

export const Header = tw(Flex).attrs({
  element: 'header',
  alignItems: 'center',
})`pt-4 pb-2 w-full gap-8 px-6 bg-white`;

export const Navbar = tw(Flex).attrs({
  element: 'nav',
  justifyContent: 'space-between',
  direction: 'row-reverse',
})`w-full`;
