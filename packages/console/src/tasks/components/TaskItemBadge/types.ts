import { HTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { TaskItemTypeWithData } from 'tasks/types';

import { taskItemBadge } from './TaskItemBadge.cva';

type TaskItemBadgeProps = $<
  {},
  VariantProps<typeof taskItemBadge>,
  HTMLAttributes<HTMLDivElement> & TaskItemTypeWithData
>;

export type TaskItemBadgeComponentProps = Component<TaskItemBadgeProps>;

export type TaskItemBadgeStyledProps = Styled<TaskItemBadgeProps>;
