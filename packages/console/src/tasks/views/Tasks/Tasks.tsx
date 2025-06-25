import React from 'react';
import { useQuery } from '@apollo/client';
import { ArrowsClockwise } from '@phosphor-icons/react';

import { Button, Flex, Loader, ToggleGroup, Tooltip } from 'shared';
import useFilters from 'shared/hooks/useFilters';

import { Task, tasksFilters } from 'tasks';

import { TasksProps } from './types';

import { TASKS_QUERY } from './Tasks.queries';

const Tasks: React.FC<TasksProps> = ({ org }) => {
  const { filterValues, filterParams, filterOptions, filterChangeFns } =
    useFilters(tasksFilters);

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading, refetch } = useQuery(TASKS_QUERY, {
    variables: {
      org_id: org.id,
      filter: filterParams,
    },
  });

  return (
    <Flex direction="column" className="gap-8">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        className="h-9 gap-6"
      >
        <Flex className="gap-4">
          <ToggleGroup
            optional
            defaultValue={filterValues.scheduled}
            options={filterOptions.scheduled}
            onValueChange={filterChangeFns.scheduled}
          />
        </Flex>
        <Flex className="gap-2">
          <Tooltip body="Refresh tasks">
            <Button
              variant="ghost"
              icon
              onClick={() => refetch()}
              disabled={loading}
            >
              <ArrowsClockwise />
            </Button>
          </Tooltip>
          <Button to="../tasks/new">Create Task</Button>
        </Flex>
      </Flex>
      {loading && !data ? (
        <Loader />
      ) : !data?.tasks.length ? (
        <Flex justifyContent="center">No tasks</Flex>
      ) : (
        <Flex direction="column" className="gap-4">
          {data.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Tasks;
