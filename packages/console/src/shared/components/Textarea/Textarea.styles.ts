import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { TextareaStyledProps } from './types';

export const Container = tw.div``;

export const Control = tw.textarea<
  TwcComponentProps<'textarea'> & TextareaStyledProps
>(({ $error, disabled }) => [
  '',
  $error && '',
  disabled && 'cursor-not-allowed opacity-50',
]);
