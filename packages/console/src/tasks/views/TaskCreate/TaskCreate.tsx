import React from 'react';
import { Navigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';

import { taskMessageSchema, TaskMessageInput } from '@automa/common';

import { Button, Flex, Textarea, Typography, useToast } from 'shared';
import { getFragment } from 'gql';
import { orgUri } from 'utils';

import { TASK_FRAGMENT } from 'tasks/components';

import { TaskCreateProps } from './types';

import { TASK_CREATE_MUTATION } from './TaskCreate.queries';

const TaskCreate: React.FC<TaskCreateProps> = ({ org }) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskMessageInput>({
    resolver: zodResolver(taskMessageSchema),
  });

  // TODO: Handle error
  const [taskCreate, { data, loading, error }] = useMutation(
    TASK_CREATE_MUTATION,
    {
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            tasks(existing = {}, details) {
              if (!details.storeFieldName.includes(`"org_id":${org.id}`))
                return existing;

              const newTaskRef = cache.writeFragment({
                data: getFragment(TASK_FRAGMENT, data.taskCreate),
                fragment: TASK_FRAGMENT,
              });

              return [newTaskRef, ...existing];
            },
          },
        });
      },
    },
  );

  const onSubmit: SubmitHandler<TaskMessageInput> = async (data) => {
    await taskCreate({
      variables: {
        org_id: org.id,
        input: data,
      },
    });

    toast({
      variant: 'success',
      title: 'Task created',
    });
  };

  // TODO: Show toast on error

  if (!loading && data) {
    // TODO: Go to the task view
    return <Navigate to={orgUri(org, '/tasks')} />;
  }

  return (
    <Flex fullWidth direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Create task</Typography>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Flex fullWidth direction="column" className="mb-8 gap-6">
          <Textarea
            label="Message"
            error={errors.content?.message}
            textarea={{
              ...register('content'),
              placeholder: '',
            }}
          />
        </Flex>
        <Button type="submit" disabled={loading}>
          Create
        </Button>
      </form>
    </Flex>
  );
};

export default TaskCreate;
