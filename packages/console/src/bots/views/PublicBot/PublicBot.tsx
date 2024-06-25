import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { useAnalyticsPage } from 'analytics';
import { getFragment } from 'gql';
import { Badge, Button, Flex, Loader, toast, Typography } from 'shared';
import { orgUri } from 'utils';

import { BOT_INSTALLATION_FRAGMENT } from 'bots';
import { useOrg } from 'orgs';

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
  const { botOrgName, botName } = useParams();

  const navigate = useNavigate();

  useAnalyticsPage('Product', 'Public Bot Overview');

  const { setOrgBotInstallationsCount } = useOrg();

  const { data, loading } = useQuery(PUBLIC_BOT_QUERY, {
    variables: {
      org_name: botOrgName!,
      name: botName!,
      org_id: org.id,
    },
    skip: !botOrgName || !botName,
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

      setOrgBotInstallationsCount(org.name, org.botInstallationsCount + 1);

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
        id: `Org:${org.id}`,
        fields: {
          botInstallationsCount(existing) {
            return existing + 1;
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

      setOrgBotInstallationsCount(org.name, org.botInstallationsCount - 1);

      cache.evict({ id: `BotInstallation:${bot.installation.id}` });

      cache.modify({
        id: `Org:${org.id}`,
        fields: {
          botInstallationsCount(existing) {
            return existing - 1;
          },
        },
      });

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
              <Flex alignItems="center" className="gap-4">
                <Typography variant="title4">
                  {bot.org.name}/{bot.name}
                </Typography>
                {!bot.is_published && (
                  <Badge variant="warning" size="large">
                    Private
                  </Badge>
                )}
              </Flex>
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
                <a
                  href={bot.homepage}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Typography variant="small">{bot.homepage}</Typography>
                </a>
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
