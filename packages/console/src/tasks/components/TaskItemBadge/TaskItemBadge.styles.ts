import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { TaskItemBadgeStyledProps } from './types';

import { taskItemBadge } from './TaskItemBadge.cva';

export const Container = tw.div`z-10`;

export const Content = tw.div<
  TwcComponentProps<'div'> & TaskItemBadgeStyledProps
>(({ $variant }) => [taskItemBadge({ variant: $variant })]);
