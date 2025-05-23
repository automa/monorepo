import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';
import { TaskItemType } from 'gql/graphql';

import { TASK_FRAGMENT } from './Task.queries';

export interface TaskProps extends HTMLAttributes<HTMLDivElement> {
  task: FragmentType<typeof TASK_FRAGMENT>;
  filteredOn?: TaskItemType[];
}
