import { ComponentProps } from 'react';

import { tw } from 'theme';

import { Flex, DropdownMenuItem } from 'shared';

export const Container = tw.div``;

export const Switcher = tw(
  Flex,
)`group min-w-40 font-semibold text-base lg:text-lg cursor-pointer`;

export const Icon = tw.span`rounded-md px-1 py-2 text-sm group-hover:bg-gray-200 lg:text-base`;

export const Item = tw(DropdownMenuItem)<
  ComponentProps<typeof DropdownMenuItem> & { $active?: boolean }
>(({ $active }) => [
  'h-10 min-w-48 text-sm md:text-base font-normal',
  $active && 'bg-gray-200 hover:!bg-gray-200 !text-black !cursor-default',
]);
