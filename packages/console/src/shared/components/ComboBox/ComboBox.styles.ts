import { TwcComponentProps } from 'react-twc';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';

import { tw } from 'theme';

import Flex from '../Flex';
import Typography from '../Typography';

import { ComboBoxStyledProps } from './types';

export const Trigger = tw(Popover.Trigger)<
  TwcComponentProps<typeof Popover.Trigger> & ComboBoxStyledProps<any>
>(({ $error, disabled }) => [
  'inline-flex h-9 w-80 items-center rounded-md bg-neutral-100 p-2 ring-1 ring-neutral-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500 lg:w-96',
  $error && 'ring-red-500',
  disabled && 'cursor-not-allowed bg-neutral-300 opacity-50 ring-0',
]);

export const Content = tw(Popover.Content)<
  TwcComponentProps<typeof Popover.Content> & ComboBoxStyledProps<any>
>(({ $error }) => [
  'relative z-50 min-w-80 overflow-hidden rounded-md bg-neutral-100 text-sm font-medium ring-1 ring-neutral-500 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 lg:min-w-96 lg:text-base lg:font-normal',
  $error && 'ring-red-500',
]);

export const SearchContainer = tw(Flex).attrs({
  alignItems: 'center',
})`w-full gap-2 border-b border-neutral-500 bg-neutral-100 px-3 text-neutral-400`;

export const Search = tw(Command.Input)(() => [
  'w-full bg-neutral-100 py-2 text-black placeholder:text-neutral-400 focus:outline-none',
]);

export const List = tw(
  Command.List,
)`max-h-48 overflow-y-auto overflow-x-hidden p-1`;

export const Loading = tw(Command.Loading)`relative h-18`;

export const Empty = tw(Command.Empty)`py-6 text-center text-neutral-700`;

export const Group = tw(
  Command.Group,
)`[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1`;

export const Item = tw(Command.Item)<
  TwcComponentProps<typeof Command.Item> & { $selected?: boolean }
>(({ $selected }) => [
  'flex h-8 cursor-pointer select-none items-center rounded-md px-3 text-neutral-700 data-[disabled=true]:pointer-events-none data-[selected=true]:bg-neutral-200 data-[selected=true]:text-black data-[disabled=true]:opacity-50 data-[selected=true]:outline-none',
  $selected && 'bg-neutral-200 text-black',
]);

export const Placeholder = tw.div`text-neutral-400`;

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & ComboBoxStyledProps<any>
>(({ $error }) => ['h-4 text-neutral-500', $error && 'text-red-600']);
