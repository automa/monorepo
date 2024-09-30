import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { Flex, Typography } from 'shared';

import { InputPathsStyledProps } from './types';

export const Container = tw(Flex)<
  TwcComponentProps<typeof Flex> & InputPathsStyledProps & { $focus: boolean }
>(({ $error, $disabled, $focus }) => [
  'w-full gap-2 rounded-md bg-neutral-100 p-2 ring-1 ring-neutral-500',
  $error && 'ring-red-500',
  $disabled && 'cursor-not-allowed bg-neutral-300 opacity-50 ring-0',
  $focus && 'bg-white ring-2 ring-neutral-500',
]);

export const Tag = tw(Flex).attrs({
  alignItems: 'center',
})`gap-1 rounded bg-neutral-200 px-2 py-1`;

export const TagX = tw.button`text-neutral-500 hover:text-neutral-700`;

export const Control = tw.input<
  TwcComponentProps<'input'> & InputPathsStyledProps
>(({ disabled }) => [
  'w-full bg-inherit placeholder:text-neutral-400 focus:outline-none',
  disabled && 'cursor-not-allowed',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & InputPathsStyledProps
>(({ $error }) => ['h-4 text-neutral-500', $error && 'text-red-600']);
