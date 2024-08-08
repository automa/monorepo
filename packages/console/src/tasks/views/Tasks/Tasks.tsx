import React from 'react';
import { useQuery } from '@apollo/client';

import { Button, Flex, Loader, ToggleGroup, useFilters } from 'shared';

import { Task, TaskScheduled, tasksFilters } from 'tasks';

import { TasksProps } from './types';

import { TASKS_QUERY } from './Tasks.queries';

const Tasks: React.FC<TasksProps> = ({ org }) => {
  const { filterValues, filterParams, filterOptions, filterChangeFns } =
    useFilters(tasksFilters, { scheduled: 'false' });

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(TASKS_QUERY, {
    variables: {
      org_id: org.id,
      filter: filterParams,
    },
  });

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="flex-end" alignItems="center" className="h-9 gap-6">
        <Flex className="gap-4">
          <ToggleGroup
            defaultValue={filterValues.scheduled}
            options={filterOptions.scheduled}
            onValueChange={filterChangeFns.scheduled}
          />
        </Flex>
        <Button to="../tasks/new">Create Task</Button>
      </Flex>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.tasks?.length ? (
        <Flex justifyContent="center">No tasks</Flex>
      ) : filterValues.scheduled === 'false' ? (
        <Flex direction="column" className="gap-4">
          {data.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </Flex>
      ) : (
        <Flex className="grid grid-cols-4 gap-4 md:gap-6">
          {data.tasks.map((task) => (
            <TaskScheduled key={task.id} task={task} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Tasks;
