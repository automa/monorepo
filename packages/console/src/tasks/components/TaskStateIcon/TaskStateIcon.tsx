import React from 'react';
import {
  CheckCircle,
  CircleHalf,
  CircleHalfTilt,
  MinusCircle,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react';

import { TaskState } from 'gql/graphql';
import { Tooltip, Typography } from 'shared';

import { TaskStateIconProps } from './types';

const TaskStateIcon: React.FC<TaskStateIconProps> = ({ state }) => {
  const icon =
    state === TaskState.Started ? (
      <CircleHalf className="size-5 text-yellow-500" />
    ) : state === TaskState.Skipped ? (
      <MinusCircle className="size-5 text-neutral-500" />
    ) : state === TaskState.Submitted ? (
      <CircleHalfTilt className="size-5 text-blue-500" />
    ) : state === TaskState.Completed ? (
      <CheckCircle className="size-5 text-green-500" />
    ) : state === TaskState.Cancelled ? (
      <XCircle className="size-5 text-orange-500" />
    ) : state === TaskState.Failed ? (
      <WarningCircle className="size-5 text-red-500" />
    ) : null;

  return (
    <Tooltip body={<Typography transform="capitalize">{state}</Typography>}>
      <div className="relative z-10">{icon}</div>
    </Tooltip>
  );
};

export default TaskStateIcon;
