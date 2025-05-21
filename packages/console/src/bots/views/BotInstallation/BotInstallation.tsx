import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Robot, Trash } from '@phosphor-icons/react';

import { useAnalyticsPage } from 'analytics';
import { Button, Flex, Loader, toast, Tooltip, Typography } from 'shared';

import { useOrg } from 'orgs';
import { Task } from 'tasks';

import { BotInstallationProps } from './types';

import {
  BOT_INSTALLATION_BOT_QUERY,
  BOT_INSTALLATION_TASKS_QUERY,
  BOT_UNINSTALL_MUTATION,
} from './BotInstallation.queries';

const BotInstallation: React.FC<BotInstallationProps> = ({ org }) => {
  const { botOrgName, botName } = useParams();

  const navigate = useNavigate();

  const { setOrgBotInstallationsCount } = useOrg();

  useAnalyticsPage('Bots', 'Bot Installation Overview', {
    botOrgName,
    botName,
  });

  const { data: botData, loading: botLoading } = useQuery(
    BOT_INSTALLATION_BOT_QUERY,
    {
      variables: {
        org_name: botOrgName!,
        name: botName!,
        org_id: org.id,
      },
      skip: !botOrgName || !botName,
    },
  );

  const bot = botData?.publicBot;

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(BOT_INSTALLATION_TASKS_QUERY, {
    variables: {
      org_id: org.id,
      bot_id: bot?.id as number,
    },
    skip: !bot?.id,
  });

  // TODO: Handle error
  const [botUninstall] = useMutation(BOT_UNINSTALL_MUTATION, {
    onCompleted() {
      toast({
        title: 'Bot uninstalled',
        variant: 'success',
      });

      navigate(`../bots/new/${botOrgName}/${botName}`);
    },
    update(cache) {
      if (!bot?.installation) return;

      setOrgBotInstallationsCount(org.name, org.bot_installations_count - 1);

      cache.evict({ id: `BotInstallation:${bot.installation.id}` });

      cache.modify({
        id: cache.identify(org),
        fields: {
          botInstallationsCount(existing) {
            return existing - 1;
          },
        },
      });

      cache.modify({
        id: cache.identify(bot),
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

    // TODO: Add confirmation dialog
    botUninstall({
      variables: {
        org_id: org.id,
        bot_id: bot.id,
      },
    });
  };

  return (
    <Flex direction="column" className="gap-8">
      {botLoading && !bot ? (
        <Loader />
      ) : !bot ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" className="gap-4">
              {bot.image_url ? (
                <img src={bot.image_url} alt={botName} className="size-12" />
              ) : (
                <Robot className="size-12 text-neutral-400" />
              )}
              <Flex direction="column" className="gap-2">
                <Typography variant="title6">
                  {botOrgName}/{botName}
                </Typography>
                <Typography variant="small">{bot.short_description}</Typography>
              </Flex>
            </Flex>
            {bot.installation && (
              <Flex alignItems="center" className="gap-2">
                {bot.type === 'manual' && (
                  <Button to={`../tasks/new?bot=${bot.installation.id}`}>
                    Create Task
                  </Button>
                )}
                <Tooltip body="Uninstall bot">
                  <Button variant="danger" icon onClick={click}>
                    <Trash />
                  </Button>
                </Tooltip>
              </Flex>
            )}
          </Flex>
          {loading && !data ? (
            <Loader />
          ) : !data?.tasks.length ? (
            <Flex justifyContent="center">No tasks</Flex>
          ) : (
            <Flex direction="column" className="gap-4">
              {data.tasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default BotInstallation;
