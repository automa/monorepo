import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { TypographyStyledProps } from './types';

import { typography } from './Typography.cva';

export const Container = tw.div<
  TwcComponentProps<'div'> & TypographyStyledProps
>(({ $variant, $transform, $align, $whitespace, $link }) => [
  typography({
    variant: $variant,
    transform: $transform,
    align: $align,
    whitespace: $whitespace,
  }),
  $link && 'cursor-pointer',
]);
