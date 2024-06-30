import { HTMLAttributes } from 'react';

import { IntegrationType } from '@automa/common';

export interface TaskItemBadgeProps extends HTMLAttributes<HTMLDivElement> {
  data: {
    integration: IntegrationType;
    [key: string]: any;
  };
}
