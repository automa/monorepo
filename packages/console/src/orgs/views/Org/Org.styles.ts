import { TwcComponentProps } from 'react-twc';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Container = tw.div``;

export const Nav = tw(
  NavigationMenu.List,
)`flex justify-center pb-2 shadow-border text-xs font-medium lg:text-sm bg-white overflow-x-auto scrollbar-none`;

export const Item = tw(NavigationMenu.Item)<
  TwcComponentProps<typeof NavigationMenu.Item> & { $active?: boolean }
>(({ $active }) => [
  'rounded-md px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:text-black',
  $active && '-mb-2 rounded-b-none border-b-2 border-black text-black',
]);

export const Content = tw.div`mx-auto max-w-8xl p-6 xl:px-10`;
