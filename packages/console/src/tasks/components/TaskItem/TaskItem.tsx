import React from 'react';
import { PlusCircle } from '@phosphor-icons/react';

import { IntegrationType, TaskItemType } from '@automa/common';

import { getFragment } from 'gql';
import { Anchor, Typography } from 'shared';

import { USER_AVATAR_FRAGMENT, UserAvatar } from 'users';

import { TaskItemProps } from './types';
import { originDefinitions } from './utils';

import { TASK_ITEM_FRAGMENT } from './TaskItem.queries';
import { Line, LineIcon, Subject } from './TaskItem.styles';

const TaskItem: React.FC<TaskItemProps> = ({ taskItem: data }) => {
  const taskItem = getFragment(TASK_ITEM_FRAGMENT, data);
  const user = getFragment(USER_AVATAR_FRAGMENT, taskItem.actor_user);

  if (taskItem.type === TaskItemType.Message) {
    return <div className="px-1 py-2">{taskItem.data.content}</div>;
  }

  if (taskItem.type === TaskItemType.Origin) {
    const definition =
      originDefinitions[taskItem.data.integration as IntegrationType];

    return (
      <Line>
        <LineIcon>
          <PlusCircle />
        </LineIcon>
        {taskItem.actor_user ? (
          <Subject>
            <UserAvatar user={taskItem.actor_user} size="small" />
            <Typography variant="small">{user!.name}</Typography>
          </Subject>
        ) : (
          <Typography variant="small">Someone</Typography>
        )}
        <Typography variant="small">created the task from</Typography>
        {definition ? (
          <Anchor href={definition.link(taskItem.data)}>
            <Subject>{definition.title(taskItem.data)}</Subject>
          </Anchor>
        ) : (
          <Subject>
            <Typography variant="small">UI</Typography>
          </Subject>
        )}
      </Line>
    );
  }

  return null;
};

export default TaskItem;
