import { TwcComponentProps } from 'react-twc';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(
  Flex,
)`flex-wrap gap-8 md:flex-nowrap lg:gap-10 xl:gap-12`;

export const Nav = tw(
  NavigationMenu.List,
)`flex w-48 flex-col overflow-y-auto rounded-lg bg-white p-1 shadow-card scrollbar-none`;

export const Item = tw(NavigationMenu.Item)<
  TwcComponentProps<typeof NavigationMenu.Item> & { $active?: boolean }
>(({ $active }) => [
  'rounded-md px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-black',
  $active && 'bg-neutral-200 text-black hover:bg-neutral-200',
]);

export const Content = tw(Flex)`gap-8 pt-1`;
