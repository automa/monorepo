import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { Button, Flex, Loader, Typography, toast } from 'shared';
import { getFragment } from 'gql';
import { orgUri } from 'utils';

import { BOT_INSTALLATION_FRAGMENT } from 'bots/components';

import { PublicBotProps } from './types';

import { BOT_INSTALL_MUTATION, PUBLIC_BOT_QUERY } from './PublicBot.queries';
import {
  Container,
  Description,
  Details,
  DetailsTitle,
} from './PublicBot.styles';

const PublicBot: React.FC<PublicBotProps> = ({ org }) => {
  const { botId } = useParams() as {
    botId: string;
  };

  const id = parseInt(botId, 10);

  const { data, loading } = useQuery(PUBLIC_BOT_QUERY, {
    variables: {
      id,
    },
    skip: !id,
  });

  // TODO: Handle error
  const [botInstall, { data: writeData, loading: writeLoading, error }] =
    useMutation(BOT_INSTALL_MUTATION, {
      onCompleted() {
        toast({
          title: 'Bot installed',
          variant: 'success',
        });
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            botInstallations(existing = {}, details) {
              if (!details.storeFieldName.includes(`"org_id":${org.id}`))
                return existing;

              const newBotInstallationRef = cache.writeFragment({
                data: getFragment(BOT_INSTALLATION_FRAGMENT, data.botInstall),
                fragment: BOT_INSTALLATION_FRAGMENT,
              });

              return [...existing, newBotInstallationRef];
            },
          },
        });
      },
    });

  if (!writeLoading && writeData) {
    // TODO: Redirect to bot installation page
    return <Navigate to={orgUri(org, '/bots')} />;
  }

  const bot = data?.publicBot;

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !bot ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <Container>
          <Flex justifyContent="space-between">
            <Flex direction="column" className="gap-2">
              <Typography variant="title4">
                {bot.org.name}/{bot.name}
              </Typography>
              <Typography variant="large">{bot.short_description}</Typography>
            </Flex>
            <Button
              size="large"
              onClick={() =>
                botInstall({
                  variables: {
                    org_id: org.id,
                    input: {
                      bot_id: bot.id,
                    },
                  },
                })
              }
            >
              Install
            </Button>
          </Flex>
          <Flex>
            <Details>
              <DetailsTitle>About</DetailsTitle>
              {bot.homepage && (
                <Link to={bot.homepage}>
                  <Typography variant="small">{bot.homepage}</Typography>
                </Link>
              )}
            </Details>
            <Description>{bot.description}</Description>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default PublicBot;
