import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import Typography from '../Typography';

import { InputStyledProps } from './types';

export const Control = tw.input<TwcComponentProps<'input'> & InputStyledProps>(
  ({ $error, disabled }) => [
    'w-64 rounded-md bg-gray-100 p-2 ring-1 ring-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500',
    $error && 'ring-red-500',
    disabled && 'cursor-not-allowed bg-gray-300 opacity-50 ring-0',
  ],
);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & InputStyledProps
>(({ $error }) => ['h-4 text-gray-500', $error && 'text-red-600']);
