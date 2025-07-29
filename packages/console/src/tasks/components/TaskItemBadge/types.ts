import { HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { TaskItemFragment } from 'gql/graphql';

import { taskItemBadge } from './TaskItemBadge.cva';

type TaskItemBadgeProps = $<
  {},
  VariantProps<typeof taskItemBadge>,
  {
    taskItem: TaskItemFragment;
    linkPrefix?: string;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TaskItemBadgeComponentProps = Component<TaskItemBadgeProps>;

export type TaskItemBadgeStyledProps = Styled<TaskItemBadgeProps>;
