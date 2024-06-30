import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { getFragment } from 'gql';
import { Flex, Loader, Typography } from 'shared';

import { TASK_FRAGMENT, TaskItem } from 'tasks';

import { TaskProps } from './types';

import { TASK_QUERY } from './Task.queries';
import { Container } from './Task.styles';

const Task: React.FC<TaskProps> = ({ org }) => {
  const { id } = useParams<{ id: string }>();

  const { data, loading } = useQuery(TASK_QUERY, {
    variables: {
      org_id: org.id,
      id: parseInt(id || '0', 10),
    },
  });

  const task = getFragment(TASK_FRAGMENT, data?.task);

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !task ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <Container>
          <Flex direction="column" className="gap-8">
            <Typography variant="title4">{task.title}</Typography>
            <Flex direction="column" className="gap-6">
              {task.items.map((item, index) => (
                <TaskItem key={index} taskItem={item} />
              ))}
            </Flex>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default Task;
