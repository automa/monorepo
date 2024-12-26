import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { botCreateSchema } from '@automa/common';

import { getFragment } from 'gql';
import { BotCreateInput, BotType } from 'gql/graphql';
import {
  Button,
  Flex,
  Input,
  Select,
  SelectItem,
  toast,
  Typography,
} from 'shared';

import { BOT_BASE_FRAGMENT, InputPaths } from 'bots';

import { BotCreateProps } from './types';

import { BOT_CREATE_MUTATION } from './BotCreate.queries';

const BotCreate: React.FC<BotCreateProps> = ({ org }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BotCreateInput>({
    resolver: zodResolver(botCreateSchema),
    defaultValues: {
      type: BotType.Manual,
      draft_paths: [],
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
                data: getFragment(BOT_BASE_FRAGMENT, data.botCreate),
                fragment: BOT_BASE_FRAGMENT,
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
            input={{
              ...register('name', {
                setValueAs: (value) => value || undefined,
              }),
              placeholder: 'ai-bot',
            }}
          />
          <Input
            label="Very short description"
            description="This description will be shown as a tagline under your bot to give users a quick idea of what it does."
            error={errors.short_description?.message}
            input={{
              ...register('short_description', {
                setValueAs: (value) => value || undefined,
              }),
              placeholder: 'Uses AI to code.',
            }}
          />
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Bot type"
                description="The type of bot you want to create. Manual bots are triggered by users, while scheduled bots run on a schedule."
                error={errors.type?.message}
                select={{
                  ...register('type'),
                  value,
                  onChange,
                }}
              >
                <SelectItem value={BotType.Manual}>Manual</SelectItem>
                <SelectItem value={BotType.Scheduled}>Scheduled</SelectItem>
              </Select>
            )}
          />
          <Input
            label="Webhook URL"
            description="The URL where your bot will receive webhooks from Automa."
            error={errors.webhook_url?.message}
            input={{
              ...register('webhook_url', {
                setValueAs: (value) => value || undefined,
              }),
              placeholder: 'https://example.com/hook',
            }}
          />
          <Controller
            control={control}
            name="draft_paths"
            render={({ field: { name, disabled, value, onChange } }) => (
              <InputPaths
                label="Code paths"
                description="Paths of the codebase this bot is restricted to."
                error={errors.draft_paths?.message}
                {...{
                  name,
                  disabled,
                  value,
                  onChange,
                }}
                placeholder="src, test"
              />
            )}
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
