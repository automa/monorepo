import React from 'react';
import { PlusCircle } from '@phosphor-icons/react';

import { IntegrationType, TaskItemType } from '@automa/common';

import { Anchor, Flex, Typography } from 'shared';

import { TaskItemProps } from './types';
import { originDefinitions } from './utils';

import { ActivityLink } from './TaskItem.styles';

const TaskItem: React.FC<TaskItemProps> = ({ taskItem }) => {
  if (taskItem.type === TaskItemType.Message) {
    return <div className="px-1 py-2">{taskItem.data.content}</div>;
  }

  if (taskItem.type === TaskItemType.Origin) {
    const definition =
      originDefinitions[taskItem.data.integration as IntegrationType];

    if (!definition) {
      return null;
    }

    return (
      <Flex alignItems="center" className="gap-2 text-neutral-500">
        <PlusCircle className="size-4" />
        <Typography variant="small">Task created from</Typography>
        <Anchor href={definition.link(taskItem.data)}>
          <ActivityLink>{definition.title(taskItem.data)}</ActivityLink>
        </Anchor>
      </Flex>
    );
  }

  return null;
};

export default TaskItem;
