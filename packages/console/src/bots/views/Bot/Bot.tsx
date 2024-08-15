import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { BotUpdateInput, botUpdateSchema } from '@automa/common';

import { getFragment } from 'gql';
import {
  Button,
  Flex,
  Input,
  Loader,
  Textarea,
  toast,
  Typography,
} from 'shared';

import { botTypeDefinition } from 'bots/utils';

import { BotProps } from './types';

import {
  BOT_QUERY,
  BOT_UPDATE_MUTATION,
  BOT_VIEW_FRAGMENT,
} from './Bot.queries';
import { Label, SectionTitle } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ org }) => {
  const { botName } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BotUpdateInput>({
    resolver: zodResolver(botUpdateSchema),
  });

  const { data, loading } = useQuery(BOT_QUERY, {
    variables: {
      name: botName!,
      org_id: org.id,
    },
    skip: !botName,
  });

  // TODO: Handle error
  const [botUpdate, { loading: mutationLoading, error }] = useMutation(
    BOT_UPDATE_MUTATION,
    {
      onCompleted() {
        toast({
          title: 'Bot updated',
          variant: 'success',
        });
      },
    },
  );

  const bot = getFragment(BOT_VIEW_FRAGMENT, data?.bot);

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !bot ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <>
          <form
            onSubmit={handleSubmit((data) =>
              botUpdate({
                variables: {
                  org_id: org.id,
                  name: bot.name,
                  input: data,
                },
              }),
            )}
            className="w-full"
          >
            <Flex fullWidth direction="column" className="gap-6">
              <SectionTitle className="mt-0">Bot details</SectionTitle>
              <Flex direction="column" className="gap-2">
                <Label>Bot name</Label>
                <Typography>{bot.name}</Typography>
              </Flex>
              <Flex direction="column" className="gap-2">
                <Label>Bot type</Label>
                <Typography>
                  {botTypeDefinition[bot.type]?.description}
                </Typography>
              </Flex>
              <Input
                label="Very short description"
                description="This description will be shown as a tagline under your bot to give users a quick idea of what it does."
                error={errors.short_description?.message}
                input={{
                  ...register('short_description'),
                  defaultValue: bot.short_description,
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
                  defaultValue: bot.description || '',
                  placeholder: 'This bot uses AI to do the given task.',
                }}
              />
              <SectionTitle>Webhook</SectionTitle>
              <Input
                label="Webhook URL"
                description="The URL where your bot will receive events from Automa."
                error={errors.webhook_url?.message}
                input={{
                  ...register('webhook_url'),
                  defaultValue: bot.webhook_url,
                  placeholder: 'https://example.com/hook',
                }}
              />
              {/* TODO: Better UX for secret. Click to reveal and copy. */}
              <Flex direction="column" className="gap-2">
                <Label>Webhook secret</Label>
                <Typography>{bot.webhook_secret}</Typography>
              </Flex>
            </Flex>
            <Button type="submit" disabled={mutationLoading} className="mt-8">
              Update
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default Bot;
