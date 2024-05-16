import React from 'react';
import { useQuery } from '@apollo/client';

import { Button, Flex, Link, Loader } from 'shared';
import { orgUri } from 'utils';
import { Task } from 'tasks';

import { TasksProps } from './types';

import { TASKS_QUERY } from './Tasks.queries';

const Tasks: React.FC<TasksProps> = ({ org }) => {
  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(TASKS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="flex-end" alignItems="center" className="h-9">
        <Link to={orgUri(org, '/tasks/new')}>
          <Button>Create Task</Button>
        </Link>
      </Flex>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.tasks?.length ? (
        <Flex justifyContent="center">No tasks</Flex>
      ) : (
        <Flex direction="column" className="gap-2">
          {data.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Tasks;
