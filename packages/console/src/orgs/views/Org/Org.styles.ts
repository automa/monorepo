import { TwcComponentProps } from 'react-twc';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Nav = tw(
  NavigationMenu.List,
)`flex justify-center pb-0.5 shadow-border text-xs font-medium lg:text-sm bg-white overflow-x-auto scrollbar-none`;

export const Item = tw(NavigationMenu.Item)<
  TwcComponentProps<typeof NavigationMenu.Item> & { $active?: boolean }
>(({ $active }) => [
  'rounded-md px-3 py-2 mb-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-200 hover:text-black',
  $active && '-mb-0.5 pb-3.5 rounded-b-none border-b-2 border-black text-black',
]);

export const Content = tw.div`mx-auto max-w-8xl p-6 xl:px-10`;
