import { TwcComponentProps } from 'react-twc';

import { tw, twp } from 'theme';

import { ButtonStyledProps } from './types';
import { button } from './Button.cva';

export const Container = tw.button<
  TwcComponentProps<'button'> & ButtonStyledProps
>(({ $variant, $size, $fullWidth, disabled }) => [
  button({ variant: $variant, size: $size }),
  $fullWidth && twp`w-full justify-center`,
  disabled && twp`cursor-default opacity-50`,
]);
