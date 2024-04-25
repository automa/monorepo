import React from 'react';
import { Navigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';

import { BotType, botCreateSchema, BotCreateInput } from '@automa/common';

import { Button, Flex, Input, Textarea, Typography } from 'shared';
import { getFragment } from 'gql';
import { orgUri } from 'utils';

import { BOT_FRAGMENT } from 'bots/components';

import { BotCreateProps } from './types';

import { BOT_CREATE_MUTATION } from './BotCreate.queries';

const BotCreate: React.FC<BotCreateProps> = ({ org }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BotCreateInput>({
    resolver: zodResolver(botCreateSchema),
    defaultValues: {
      type: BotType.Webhook,
    },
  });

  const [botCreate, { data, loading, error }] = useMutation(
    BOT_CREATE_MUTATION,
    {
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            org(existingOrg = {}) {
              const newBotRef = cache.writeFragment({
                data: getFragment(BOT_FRAGMENT, data.botCreate),
                fragment: BOT_FRAGMENT,
              });

              return { ...existingOrg, bots: [...existingOrg.bots, newBotRef] };
            },
          },
        });
      },
    },
  );

  const onSubmit: SubmitHandler<BotCreateInput> = async (data) => {
    await botCreate({
      variables: {
        org_id: org.id,
        input: data,
      },
    });
    // TODO: Show success toast
  };

  // TODO: Show toast on error

  if (!loading && data) {
    // TODO: Go to the bot view
    return <Navigate to={orgUri(org, '/settings/bots')} />;
  }

  return (
    <Flex fullWidth direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Create bot</Typography>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Flex fullWidth direction="column" className="mb-8 gap-6">
          <Input
            label="Bot name"
            description="The name of your Automa bot."
            error={errors.name?.message}
            input={{ ...register('name'), placeholder: 'ai-bot' }}
          />
          <Textarea
            label="Description"
            optional
            description="A short description of your bot. This will be displayed to Automa users."
            error={errors.description?.message}
            textarea={{
              ...register('description'),
              placeholder: 'This bot uses AI to do the given task.',
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

export default BotCreate;
