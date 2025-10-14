import { FragmentType } from 'gql';

import { TASK_ITEM_FRAGMENT } from './TaskItem.queries';

export interface TaskItemProps {
  taskItem: FragmentType<typeof TASK_ITEM_FRAGMENT>;
}
