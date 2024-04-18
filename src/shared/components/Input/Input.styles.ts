import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { InputStyledProps } from './types';

export const Container = tw.div``;

export const Control = tw.input<TwcComponentProps<'input'> & InputStyledProps>(
  ({ $error, disabled }) => [
    '',
    $error && '',
    disabled && 'cursor-not-allowed opacity-50',
  ],
);
