import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { getFragment } from 'gql';
import { Flex, Loader, Typography } from 'shared';

import { Org } from 'orgs';
import { TASK_FRAGMENT } from 'tasks';

import TaskItem from 'tasks/components/TaskItem';

import { TASK_QUERY } from './Task.queries';
import { Container } from './Task.styles';

const Task: React.FC = () => {
  const { org } = useOutletContext<{ org: Org }>();

  const { id } = useParams();

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
        <Loader />
      ) : !task ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <Container>
          <Flex direction="column" className="gap-8">
            <Typography variant="title4">{task.title}</Typography>
            <Flex direction="column" className="gap-6">
              {task.items.map((item, index) => (
                <TaskItem
                  key={index}
                  taskItem={item}
                  scheduled={task.is_scheduled}
                />
              ))}
            </Flex>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default Task;
