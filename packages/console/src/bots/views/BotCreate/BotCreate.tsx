import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { BotCreateInput, botCreateSchema, BotType } from '@automa/common';

import { getFragment } from 'gql';
import { Button, Flex, Input, Textarea, toast, Typography } from 'shared';

import { BOT_FRAGMENT } from 'bots';

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

  // TODO: Handle error
  const [botCreate, { data, loading, error }] = useMutation(
    BOT_CREATE_MUTATION,
    {
      onCompleted() {
        toast({
          title: 'Bot created',
          variant: 'success',
        });
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            bots(existing = {}, details) {
              if (!details.storeFieldName.includes(`"org_id":${org.id}`))
                return existing;

              const newBotRef = cache.writeFragment({
                data: getFragment(BOT_FRAGMENT, data.botCreate),
                fragment: BOT_FRAGMENT,
              });

              return [...existing, newBotRef];
            },
          },
        });
      },
    },
  );

  if (!loading && data) {
    // TODO: Go to the bot view
    return <Navigate to="../bots" />;
  }

  return (
    <>
      <Typography variant="title6">Create bot</Typography>
      <form
        onSubmit={handleSubmit((data) =>
          botCreate({
            variables: {
              org_id: org.id,
              input: data,
            },
          }),
        )}
        className="w-full"
      >
        <Flex fullWidth direction="column" className="mb-8 gap-6">
          <Input
            label="Bot name"
            description="The name of your Automa bot."
            error={errors.name?.message}
            input={{ ...register('name'), placeholder: 'ai-bot' }}
          />
          <Input
            label="Very short description"
            description="This description will be shown as a tagline under your bot to give users a quick idea of what it does."
            error={errors.short_description?.message}
            input={{
              ...register('short_description'),
              placeholder: 'Uses AI to code.',
            }}
          />
          <Textarea
            label="Description"
            optional
            description="A full description of your bot. This will be shown on the bot's page."
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
    </>
  );
};

export default BotCreate;
