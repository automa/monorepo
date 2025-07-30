import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { ButtonStyledProps } from './types';

import { button } from './Button.cva';

export const Container = tw.button<
  TwcComponentProps<'button'> & ButtonStyledProps
>(({ $variant, $size, $icon, $fullWidth, disabled }) => [
  button({ variant: $variant, size: $size, icon: $icon }),
  $fullWidth && 'w-full justify-center',
  disabled && 'cursor-default opacity-50',
]);
