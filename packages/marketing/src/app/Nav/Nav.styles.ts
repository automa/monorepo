import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Container = tw.div`hidden lg:block`;

export const List = tw(
  NavigationMenu.List,
)`flex flex-col lg:flex-row gap-6 font-medium text-lg text-gray-800`;
