import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { Flex, Typography } from 'shared';
import { DropdownMenuItem } from 'shared/components/DropdownMenu';

export const Switcher = tw(
  Flex,
)`group min-w-40 cursor-pointer text-base font-semibold lg:text-lg`;

export const Placeholder = tw(Typography)`text-neutral-400`;

export const Icon = tw.span`rounded-md px-1 py-2 text-sm group-hover:bg-neutral-200 lg:text-base`;

export const Item = tw(DropdownMenuItem)<
  TwcComponentProps<typeof DropdownMenuItem> & { $active?: boolean }
>(({ $active }) => [
  'h-10 min-w-48 text-sm font-normal md:text-base',
  $active && '!cursor-default bg-neutral-200 !text-black hover:!bg-neutral-200',
]);
