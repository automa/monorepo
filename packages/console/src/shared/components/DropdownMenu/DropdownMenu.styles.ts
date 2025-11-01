import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { tw } from 'theme';

export const Container = tw.div``;

export const Content = tw(
  DropdownMenu.Content,
)`z-50 min-w-32 overflow-hidden rounded-lg bg-white p-1 text-xs text-neutral-700 shadow-menu outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 lg:text-sm`;

export const Group = tw(DropdownMenu.Group)``;

export const Item = tw(
  DropdownMenu.Item,
)`flex h-8 cursor-pointer items-center rounded-md px-3 data-[disabled]:cursor-not-allowed data-[highlighted]:bg-neutral-100 data-[disabled]:text-neutral-400 data-[highlighted]:text-black data-[highlighted]:outline-none hover:bg-neutral-100 hover:text-black data-[disabled]:hover:bg-transparent`;

export const Label = tw(
  DropdownMenu.Label,
)`flex h-8 items-center px-3 text-neutral-500`;

export const Separator = tw(DropdownMenu.Separator)`my-1 h-0.25 bg-neutral-100`;

export const Sub = tw(DropdownMenu.Sub)``;

export const SubContent = tw(
  DropdownMenu.SubContent,
)`z-50 min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;
