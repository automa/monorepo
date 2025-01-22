import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { DropdownMenuItem, Flex, Typography } from 'shared';

export const Switcher = tw(
  Flex,
)`group min-w-40 font-semibold text-base lg:text-lg cursor-pointer`;

export const Placeholder = tw(Typography)`text-neutral-400`;

export const Icon = tw.span`rounded-md px-1 py-2 text-sm group-hover:bg-neutral-200 lg:text-base`;

export const Item = tw(DropdownMenuItem)<
  TwcComponentProps<typeof DropdownMenuItem> & { $active?: boolean }
>(({ $active }) => [
  'h-10 min-w-48 text-sm md:text-base font-normal',
  $active && 'bg-neutral-200 hover:!bg-neutral-200 !text-black !cursor-default',
]);
