import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { tw } from 'theme';

export const Container = tw.div``;

export const Content = tw(
  DropdownMenu.Content,
)`z-50 p-1 bg-white text-gray-700 text-xs lg:text-sm outline-none rounded-lg shadow-menu min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;

export const Group = tw(DropdownMenu.Group)``;

export const Item = tw(
  DropdownMenu.Item,
)`h-8 px-3 flex items-center rounded-md cursor-pointer hover:text-black hover:bg-gray-100 data-[highlighted]:outline-none data-[highlighted]:text-black data-[highlighted]:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent`;

export const Label = tw(
  DropdownMenu.Label,
)`h-8 px-3 text-gray-500 flex items-center`;

export const Separator = tw(DropdownMenu.Separator)`bg-gray-100 my-1 h-0.25`;

export const Sub = tw(DropdownMenu.Sub)``;

export const SubContent = tw(
  DropdownMenu.SubContent,
)`z-50 min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;
