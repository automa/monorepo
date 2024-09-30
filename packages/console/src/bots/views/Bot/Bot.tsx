import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { botUpdateSchema } from '@automa/common';

import { getFragment } from 'gql';
import { BotUpdateInput } from 'gql/graphql';
import { useGateValue } from 'optimizer';
import {
  Button,
  Flex,
  Input,
  Loader,
  Textarea,
  toast,
  Tooltip,
  Typography,
} from 'shared';

import { InputPaths } from 'bots';

import { botTypeDefinition } from 'bots/utils';

import { BotProps } from './types';

import {
  BOT_FRAGMENT,
  BOT_PUBLISH_MUTATION,
  BOT_QUERY,
  BOT_UPDATE_MUTATION,
} from './Bot.queries';
import { Label, SectionTitle } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ org }) => {
  const { botName } = useParams();

  const {
    register,
    control,
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
  const [botUpdate, { loading: updateLoading, error: updateError }] =
    useMutation(BOT_UPDATE_MUTATION, {
      onCompleted() {
        toast({
          title: 'Bot updated',
          variant: 'success',
        });
      },
    });

  const [botPublish, { loading: publishLoading, error: publishError }] =
    useMutation(BOT_PUBLISH_MUTATION, {
      onCompleted() {
        toast({
          title: 'Bot published',
          variant: 'success',
        });
      },
    });

  const bot = getFragment(BOT_FRAGMENT, data?.bot);

  const isCloud = useGateValue('cloud');
  const needsApproval = isCloud && bot && bot.is_published;
  const needsMarketplaceApproval =
    needsApproval &&
    JSON.stringify(bot.draft_paths) !== JSON.stringify(bot.paths);

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !bot ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <Flex fullWidth direction="column" className="gap-8 pb-8">
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
              <Controller
                control={control}
                name="draft_paths"
                defaultValue={bot.draft_paths}
                render={({ field: { value, onChange } }) => (
                  <InputPaths
                    label="Code paths"
                    optional
                    description="Paths of the codebase this bot is restricted to."
                    error={errors.draft_paths?.message}
                    {...{
                      ...register('draft_paths'),
                      value: value ?? undefined,
                      onChange,
                    }}
                    placeholder="src, test"
                  />
                )}
              />
              <SectionTitle>Webhook</SectionTitle>
              <Input
                label="Webhook URL"
                description="The URL where your bot will receive webhooks from Automa."
                error={errors.webhook_url?.message}
                input={{
                  ...register('webhook_url'),
                  defaultValue: bot.webhook_url,
                  placeholder: 'https://example.com/hook',
                }}
              />
              {/* TODO: Better UX for secret. Click to reveal and copy. */}
              {/* TODO: Click to regenerate secret. */}
              <Flex direction="column" className="gap-2">
                <Label>Webhook secret</Label>
                <Typography>{bot.webhook_secret}</Typography>
              </Flex>
              <SectionTitle>Marketplace details</SectionTitle>
              <Input
                label="Homepage"
                optional
                description="The URL to your bot's website."
                error={errors.homepage?.message}
                input={{
                  ...register('homepage'),
                  defaultValue: bot.homepage ?? undefined,
                  placeholder: 'https://example.com',
                }}
              />
              <Textarea
                label="Description"
                optional
                description="A full description of your bot. This will be shown on the bot's page."
                error={errors.description?.message}
                textarea={{
                  ...register('description'),
                  defaultValue: bot.description ?? undefined,
                  placeholder: 'This bot uses AI to do the given task.',
                }}
              />
            </Flex>
            <Button type="submit" disabled={updateLoading} className="mt-8">
              Update
            </Button>
          </form>
          <Flex direction="column" className="gap-6">
            <SectionTitle>Publishing</SectionTitle>
            {bot.is_published ? (
              <>
                <Typography variant="large">Your bot is published.</Typography>
                {needsMarketplaceApproval && (
                  <>
                    <Typography className="text-red-600">
                      Your bot has updates to restricted fields. You need to
                      request approval to publish your changes. Please contact
                      support.
                    </Typography>
                    <Tooltip body="Coming soon!">
                      <Button disabled>Submit for approval</Button>
                    </Tooltip>
                  </>
                )}
              </>
            ) : (
              <>
                <Typography variant="large">
                  Your bot is not published.
                </Typography>
                <Typography className="text-red-600">
                  Publishing your bot will make it available to all users. You
                  cannot delete a bot once it is published.
                </Typography>
                <div>
                  <Button
                    onClick={() =>
                      botPublish({
                        variables: {
                          org_id: org.id,
                          name: bot.name,
                        },
                      })
                    }
                    disabled={publishLoading}
                  >
                    Publish
                  </Button>
                </div>
              </>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Bot;
