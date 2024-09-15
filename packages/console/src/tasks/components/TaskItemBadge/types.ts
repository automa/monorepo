import { HTMLAttributes } from 'react';

import { IntegrationType } from '@automa/common';

import { TaskItemData } from 'tasks/types';

export interface TaskItemBadgeProps extends HTMLAttributes<HTMLDivElement> {
  data: TaskItemData & { integration: IntegrationType };
}
