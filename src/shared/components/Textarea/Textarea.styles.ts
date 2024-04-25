import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import Typography from '../Typography';

import { TextareaStyledProps } from './types';

export const Container = tw.div``;

export const Control = tw.textarea<
  TwcComponentProps<'textarea'> & TextareaStyledProps
>(({ $error, disabled }) => [
  '',
  $error && '',
  disabled && 'cursor-not-allowed opacity-50',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & TextareaStyledProps
>(({ $error }) => ['', $error && '']);
