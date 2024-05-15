import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Container = tw.div`hidden py-4 lg:block`;

export const List = tw(
  NavigationMenu.List,
)`flex flex-col lg:flex-row gap-6 text-lg text-gray-800`;
