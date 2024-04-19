import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { tw } from 'theme';

export const Container = tw.div``;

export const Content = tw(
  DropdownMenu.Content,
)`z-50 min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;

export const Arrow = tw(DropdownMenu.Arrow)``;

export const Group = tw(DropdownMenu.Group)``;

export const Item = tw(DropdownMenu.Item)``;

export const Label = tw(DropdownMenu.Label)``;

export const Separator = tw(DropdownMenu.Separator)``;

export const Sub = tw(DropdownMenu.Sub)``;

export const SubContent = tw(
  DropdownMenu.SubContent,
)`z-50 min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;
