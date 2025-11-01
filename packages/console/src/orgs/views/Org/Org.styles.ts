import { TwcComponentProps } from 'react-twc';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Nav = tw(
  NavigationMenu.List,
)`flex justify-center overflow-x-auto bg-white pb-0.5 shadow-border scrollbar-none`;

export const Item = tw(NavigationMenu.Item)<
  TwcComponentProps<typeof NavigationMenu.Item> & { $active?: boolean }
>(({ $active }) => [
  'mb-1.5 rounded-md px-3 py-2 text-neutral-600 transition-all duration-200 hover:bg-neutral-200 hover:text-black',
  $active && '-mb-0.5 rounded-b-none border-b-2 border-black pb-3.5 text-black',
]);

export const Content = tw.div`mx-auto max-w-8xl p-6 xl:px-10`;
