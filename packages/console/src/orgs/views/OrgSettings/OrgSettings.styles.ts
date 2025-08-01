import { TwcComponentProps } from 'react-twc';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(
  Flex,
)`gap-8 lg:gap-10 xl:gap-12 flex-wrap md:flex-nowrap`;

export const Nav = tw(
  NavigationMenu.List,
)`flex flex-col w-48 p-1 bg-white rounded-lg overflow-y-auto scrollbar-none shadow-card`;

export const Item = tw(NavigationMenu.Item)<
  TwcComponentProps<typeof NavigationMenu.Item> & { $active?: boolean }
>(({ $active }) => [
  'rounded-md px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-black',
  $active && 'bg-neutral-200 hover:bg-neutral-200 text-black',
]);

export const Content = tw(Flex)`pt-1 gap-8`;
