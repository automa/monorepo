import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { BadgeStyledProps } from './types';

import { badge } from './Badge.cva';

export const Container = tw.div<TwcComponentProps<'div'> & BadgeStyledProps>(
  ({ $variant }) => [badge({ variant: $variant })],
);
