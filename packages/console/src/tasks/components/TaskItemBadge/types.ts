import { HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { TaskItemFragment } from 'gql/graphql';

import { taskItemBadge } from './TaskItemBadge.cva';

type TaskItemBadgeProps = $<
  {},
  VariantProps<typeof taskItemBadge>,
  HTMLAttributes<HTMLDivElement> & {
    taskItem: TaskItemFragment;
  }
>;

export type TaskItemBadgeComponentProps = Component<TaskItemBadgeProps>;

export type TaskItemBadgeStyledProps = Styled<TaskItemBadgeProps>;
