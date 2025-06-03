import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { tw } from 'theme';

export const Container = tw.div`hidden py-4 lg:block`;

export const NavList = tw(
  NavigationMenu.List,
)`flex flex-col lg:flex-row lg:gap-6 leading-8 text-neutral-800 font-medium`;

export const MobileContainer = tw.div`relative lg:hidden`;

export const MobileMenuToggle = tw.label`relative z-50 flex cursor-pointer items-center justify-center rounded-md p-2 text-neutral-800 hover:bg-neutral-100`;

export const MobileMenuOverlay = tw.div`fixed left-0 right-0 top-16 z-40 scale-105 transform overflow-hidden bg-white opacity-0 shadow-sm transition-all duration-300 ease-in-out peer-checked:scale-100 peer-checked:opacity-100`;

export const MobileMenuContent = tw.div`flex max-h-96 flex-col overflow-y-auto py-4`;

export const MobileMenuLink = tw.div`px-6 py-3 text-lg hover:bg-neutral-50`;
