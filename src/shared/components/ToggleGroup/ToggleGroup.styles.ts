import { TwcComponentProps } from 'react-twc';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { tw } from 'theme';

import { ToggleGroupStyledProps } from './types';

import { toggleGroup } from './ToggleGroup.cva';

export const Container = tw.div``;

export const Item = tw(ToggleGroup.Item)<
  TwcComponentProps<typeof ToggleGroup.Item> & ToggleGroupStyledProps
>(({ $variant, $size }) => [toggleGroup({ variant: $variant, size: $size })]);
