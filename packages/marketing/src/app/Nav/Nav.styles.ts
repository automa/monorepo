import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Container = tw.div`invisible md:visible`;

export const List = tw(NavigationMenu.List)`flex gap-4 font-medium text-lg`;
