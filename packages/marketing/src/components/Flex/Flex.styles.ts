import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { FlexStyledProps } from './types';
import { flex } from './Flex.cva';

export const Container = tw.div<TwcComponentProps<'div'> & FlexStyledProps>(
  ({
    $inline,
    $fullWidth,
    $direction,
    $wrap,
    $justifyContent,
    $justifyItems,
    $alignContent,
    $alignItems,
  }) => [
    flex({
      direction: $direction,
      wrap: $wrap,
      justifyContent: $justifyContent,
      justifyItems: $justifyItems,
      alignContent: $alignContent,
      alignItems: $alignItems,
    }),
    $inline ? 'inline-flex' : 'flex',
    $fullWidth && 'w-full',
  ],
);
