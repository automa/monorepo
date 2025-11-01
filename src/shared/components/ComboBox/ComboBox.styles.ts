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
  '',
  $error && '',
  disabled && 'cursor-not-allowed opacity-50',
]);

export const Content = tw(Popover.Content)<
  TwcComponentProps<typeof Popover.Content> & ComboBoxStyledProps<any>
>(({ $error }) => [
  'relative z-50 min-w-32 overflow-hidden data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  $error && '',
]);

export const SearchContainer = tw(Flex).attrs({
  alignItems: 'center',
})`w-full`;

export const Search = tw(Command.Input)(() => ['w-full']);

export const List = tw(
  Command.List,
)`max-h-48 overflow-y-auto overflow-x-hidden`;

export const Loading = tw(Command.Loading)``;

export const Empty = tw(Command.Empty)``;

export const Group = tw(Command.Group)``;

export const Item = tw(Command.Item)<
  TwcComponentProps<typeof Command.Item> & { $selected?: boolean }
>(({ $selected }) => [
  'flex h-8 cursor-pointer select-none items-center rounded-md px-3 text-neutral-700 data-[disabled=true]:pointer-events-none data-[selected=true]:bg-neutral-200 data-[selected=true]:text-black data-[disabled=true]:opacity-50 data-[selected=true]:outline-none',
  $selected && '',
]);

export const Placeholder = tw.div`text-neutral-400`;

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & ComboBoxStyledProps<any>
>(({ $error }) => ['', $error && '']);
