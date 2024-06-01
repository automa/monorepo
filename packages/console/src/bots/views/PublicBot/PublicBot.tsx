import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { Button, Flex, Loader, Typography, toast } from 'shared';
import { getFragment } from 'gql';
import { orgUri } from 'utils';

import { BOT_INSTALLATION_FRAGMENT } from 'bots/components';

import { PublicBotProps } from './types';

import {
  BOT_INSTALL_MUTATION,
  BOT_UNINSTALL_MUTATION,
  PUBLIC_BOT_QUERY,
} from './PublicBot.queries';
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

  const navigate = useNavigate();

  const { data, loading } = useQuery(PUBLIC_BOT_QUERY, {
    variables: {
      id,
      org_id: org.id,
    },
    skip: !id,
  });

  const bot = data?.publicBot;

  // TODO: Handle error
  const [botInstall] = useMutation(BOT_INSTALL_MUTATION, {
    onCompleted() {
      toast({
        title: 'Bot installed',
        variant: 'success',
      });

      // TODO: Redirect to bot installation page
      navigate(orgUri(org, '/bots'));
    },
    update(cache, { data }) {
      if (!bot || !data) return;

      const newBotInstallationRef = cache.writeFragment({
        data: getFragment(BOT_INSTALLATION_FRAGMENT, data.botInstall),
        fragment: BOT_INSTALLATION_FRAGMENT,
      });

      cache.modify({
        fields: {
          botInstallations(existing = {}, details) {
            if (!details.storeFieldName.includes(`"org_id":${org.id}`))
              return existing;

            return [...existing, newBotInstallationRef];
          },
        },
      });

      cache.modify({
        id: `PublicBot:${bot.id}`,
        fields: {
          installation(existing, details) {
            if (!details.storeFieldName.includes(`"org_id":${org.id}`))
              return existing;

            return newBotInstallationRef;
          },
        },
      });
    },
  });

  // TODO: Handle error
  const [botUninstall] = useMutation(BOT_UNINSTALL_MUTATION, {
    onCompleted() {
      toast({
        title: 'Bot uninstalled',
        variant: 'success',
      });
    },
    update(cache) {
      if (!bot?.installation) return;

      cache.evict({ id: `BotInstallation:${bot.installation.id}` });

      cache.modify({
        id: `PublicBot:${bot.id}`,
        fields: {
          installation(existing, details) {
            if (!details.storeFieldName.includes(`"org_id":${org.id}`))
              return existing;

            return null;
          },
        },
      });
    },
  });

  const click = () => {
    if (!bot) return;

    if (!bot.installation) {
      botInstall({
        variables: {
          org_id: org.id,
          input: {
            bot_id: bot.id,
          },
        },
      });
    } else {
      // TODO: Add confirmation dialog
      botUninstall({
        variables: {
          org_id: org.id,
          bot_id: bot.id,
        },
      });
    }
  };

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
              variant={!bot.installation ? 'primary' : 'danger'}
              onClick={click}
            >
              {!bot.installation ? 'Install' : 'Uninstall'}
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
