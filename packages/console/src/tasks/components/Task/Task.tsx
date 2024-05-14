import React from 'react';

import { getFragment } from 'gql';

import { TaskProps } from './types';

import { TASK_FRAGMENT } from './Task.queries';
import { Container } from './Task.styles';

const Task: React.FC<TaskProps> = ({ task: data, ...props }) => {
  const task = getFragment(TASK_FRAGMENT, data);

  return <Container {...props}>{task.title}</Container>;
};

export default Task;
