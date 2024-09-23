import { HTMLAttributes } from 'react';

import { TaskItemTypeWithData } from 'tasks/types';

export type TaskItemBadgeProps = HTMLAttributes<HTMLDivElement> &
  TaskItemTypeWithData;
