import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import Typography from '../Typography';

import { InputStyledProps } from './types';

export const Container = tw.div``;

export const Control = tw.input<TwcComponentProps<'input'> & InputStyledProps>(
  ({ $error, disabled }) => [
    '',
    $error && '',
    disabled && 'cursor-not-allowed opacity-50',
  ],
);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & InputStyledProps
>(({ $error }) => ['', $error && '']);
