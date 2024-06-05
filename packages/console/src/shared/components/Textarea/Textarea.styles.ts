import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import Typography from '../Typography';

import { TextareaStyledProps } from './types';

export const Control = tw.textarea<
  TwcComponentProps<'textarea'> & TextareaStyledProps
>(({ $error, disabled }) => [
  'w-full rounded-md bg-neutral-100 p-2 ring-1 ring-neutral-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500',
  $error && 'ring-red-500',
  disabled && 'cursor-not-allowed bg-neutral-300 opacity-50 ring-0',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & TextareaStyledProps
>(({ $error }) => ['h-4 text-neutral-500', $error && 'text-red-600']);
