import { TwcComponentProps } from 'react-twc';
import * as Select from '@radix-ui/react-select';

import { tw } from 'theme';

import Typography from '../Typography';

import { SelectStyledProps } from './types';

export const Trigger = tw(Select.Trigger)<
  TwcComponentProps<typeof Select.Trigger> & SelectStyledProps
>(({ $error, disabled }) => [
  `w-64 rounded-md bg-neutral-100 p-2 ring-1 ring-neutral-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500 data-[placeholder]:text-neutral-400`,
  $error && 'ring-red-500',
  disabled && 'cursor-not-allowed bg-neutral-300 opacity-50 ring-0',
]);

export const Value = tw(Select.Value)``;

export const Content = tw(Select.Content)<
  TwcComponentProps<typeof Select.Content> & SelectStyledProps
>(({ $error }) => [
  `relative z-50 min-w-64 overflow-hidden rounded-md p-1 bg-neutral-100 ring-1 ring-neutral-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`,
  $error && 'ring-red-500',
]);

export const ScrollUpButton = tw(Select.ScrollUpButton)``;

export const ScrollDownButton = tw(Select.ScrollDownButton)``;

export const Group = tw(Select.Group)``;

export const GroupLabel = tw(Select.Label)``;

export const Separator = tw(Select.Separator)``;

export const Item = tw(Select.Item)(({ disabled }) => [
  'h-8 px-3 flex items-center rounded-md cursor-pointer select-none text-neutral-700 data-[state="checked"]:bg-neutral-200 data-[state="checked"]:text-black data-[highlighted]:bg-neutral-200 data-[highlighted]:text-black data-[highlighted]:outline-none',
  disabled && 'pointer-events-none opacity-50',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & SelectStyledProps
>(({ $error }) => ['h-4 text-neutral-500', $error && 'text-red-600']);
