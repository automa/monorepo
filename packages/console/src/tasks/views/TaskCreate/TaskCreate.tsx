import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { taskCreateSchema } from '@automa/common';

import { getFragment } from 'gql';
import { TaskCreateInput } from 'gql/graphql';
import {
  Avatar,
  Button,
  ComboBox,
  Flex,
  Input,
  InputEditor,
  toast,
  Typography,
} from 'shared';

import { TASK_FRAGMENT } from 'tasks';

import { TaskCreateProps } from './types';

import {
  BOT_INSTALLATIONS_AS_OPTIONS_QUERY,
  REPOSITORIES_AS_OPTIONS_QUERY,
  TASK_CREATE_MUTATION,
} from './TaskCreate.queries';

const TaskCreate: React.FC<TaskCreateProps> = ({ org }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
  });

  // Load bot installations
  const { data: botInstallationsData, loading: botInstallationsLoading } =
    useQuery(BOT_INSTALLATIONS_AS_OPTIONS_QUERY, {
      variables: {
        org_id: org.id,
      },
    });

  const botInstallations = (botInstallationsData?.botInstallations ?? []).map(
    (botInstallation) => ({
      ...botInstallation,
      value: `${botInstallation.bot.org.name}/${botInstallation.bot.name}`,
    }),
  );

  // Load repositories
  const { data: repositoriesData, loading: repositoriesLoading } = useQuery(
    REPOSITORIES_AS_OPTIONS_QUERY,
    {
      variables: {
        org_id: org.id,
      },
    },
  );

  const repositories = (repositoriesData?.repos ?? []).map((repo) => ({
    ...repo,
    value: repo.name,
  }));

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
                fragmentName: 'Task',
              });

              return [newTaskRef, ...existing];
            },
          },
        });
      },
    },
  );

  const onSubmit: SubmitHandler<TaskCreateInput> = async (data) => {
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

  if (!loading && data) {
    const task = getFragment(TASK_FRAGMENT, data.taskCreate);

    return <Navigate to={`../tasks/${task.id}`} />;
  }

  return (
    <Flex fullWidth direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Create task</Typography>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Flex fullWidth direction="column" className="mb-8 gap-6">
          <Input
            label="Title"
            description="A short description of the task"
            error={errors.title?.message}
            input={{
              ...register('title'),
            }}
          />
          <Controller
            control={control}
            name="content"
            render={({ field: { name, disabled, value, onChange } }) => {
              return (
                <InputEditor
                  label="Message"
                  optional
                  description="A detailed description of the task along with relevant context"
                  error={errors.content?.message}
                  {...{
                    name,
                    disabled,
                    value,
                    onChangeAsMarkdown: onChange,
                  }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="bot_installation_id"
            render={({ field: { name, disabled, value, onChange } }) => (
              <ComboBox
                label="Bot"
                description=""
                error={errors.bot_installation_id?.message}
                {...{
                  name,
                  disabled,
                  value,
                  onChange,
                }}
                placeholder="Select bot"
                emptyText="No bots found."
                loading={botInstallationsLoading}
                options={botInstallations}
                renderOption={({ bot, value }) => (
                  <Flex alignItems="center" className="gap-2">
                    <Avatar
                      key={bot.id}
                      src={bot.image_url ?? null}
                      alt={bot.name}
                      variant="square"
                      size="xsmall"
                      className="ml-0.5"
                    />
                    {value}
                  </Flex>
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="repo_id"
            render={({ field: { name, disabled, value, onChange } }) => (
              <ComboBox
                label="Repository"
                description=""
                error={errors.repo_id?.message}
                {...{
                  name,
                  disabled,
                  value,
                  onChange,
                }}
                placeholder="Select repository"
                emptyText="No repositories found."
                loading={repositoriesLoading}
                options={repositories}
                renderOption={({ value }) => <span>{value}</span>}
              />
            )}
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
