import React from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Gear, Question, Robot } from '@phosphor-icons/react';

import { useAnalyticsPage } from 'analytics';
import { getFragment } from 'gql';
import {
  Badge,
  Button,
  Flex,
  Loader,
  toast,
  Tooltip,
  Typography,
} from 'shared';
import Editor from 'shared/components/Editor';

import { BOT_INSTALLATION_FRAGMENT } from 'bots';
import { Org, useOrg } from 'orgs';

import { BOT_INSTALL_MUTATION, PUBLIC_BOT_QUERY } from './PublicBot.queries';
import {
  Container,
  Description,
  Details,
  DetailsTitle,
} from './PublicBot.styles';

const PublicBot: React.FC = () => {
  const { org } = useOutletContext<{ org: Org }>();

  const { botOrgName, botName } = useParams();

  const navigate = useNavigate();

  useAnalyticsPage('Bots', 'Public Bot Overview', {
    botOrgName,
    botName,
  });

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

      navigate(`../../${botOrgName}/${botName}`);
    },
    update(cache, { data }) {
      if (!bot || !data) return;

      setOrgBotInstallationsCount(org.name, org.bot_installations_count + 1);

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
        id: cache.identify(org),
        fields: {
          botInstallationsCount(existing) {
            return existing + 1;
          },
        },
      });

      cache.modify({
        id: cache.identify(bot),
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

  const click = () => {
    if (!bot) return;

    botInstall({
      variables: {
        org_id: org.id,
        input: {
          bot_id: bot.id,
        },
      },
    });
  };

  return (
    <>
      {loading && !data ? (
        <Loader />
      ) : !bot ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" className="gap-4">
              {bot.image_url ? (
                <img src={bot.image_url} alt={bot.name} className="size-16" />
              ) : (
                <Robot className="size-16 text-neutral-400" />
              )}
              <Flex direction="column" className="gap-2">
                <Flex alignItems="center" className="gap-4">
                  <Typography variant="title4">
                    {bot.org.name}/{bot.name}
                  </Typography>
                  <Flex className="gap-2">
                    {!bot.is_published && (
                      <Badge variant="warning" size="large">
                        Private
                      </Badge>
                    )}
                    {bot.is_preview && (
                      <Badge variant="success" size="large">
                        Beta
                      </Badge>
                    )}
                  </Flex>
                </Flex>
                <Typography variant="large">{bot.short_description}</Typography>
              </Flex>
            </Flex>
            {!bot.installation ? (
              bot.is_preview ? (
                <Tooltip body="Coming soon!">
                  <Button size="large" disabled>
                    Install
                  </Button>
                </Tooltip>
              ) : (
                <Button size="large" onClick={click}>
                  Install
                </Button>
              )
            ) : (
              <Tooltip body="Bot installation settings">
                <Button to={`../../${botOrgName}/${botName}`} size="large" icon>
                  <Gear />
                </Button>
              </Tooltip>
            )}
          </Flex>
          <Flex className="gap-8 lg:gap-12">
            <Details>
              {bot.homepage && (
                // TODO: Long links do not look good
                <Flex direction="column" wrap="wrap" className="gap-2">
                  <DetailsTitle>About</DetailsTitle>
                  <Typography
                    href={bot.homepage}
                    blank
                    variant="small"
                    wordBreak="all"
                  >
                    {bot.homepage}
                  </Typography>
                </Flex>
              )}
              <Flex direction="column" className="gap-2">
                <DetailsTitle>Type</DetailsTitle>
                <Typography variant="small">
                  {bot.type.charAt(0).toUpperCase() + bot.type.slice(1)}
                </Typography>
              </Flex>
              <Flex direction="column" className="gap-2">
                <DetailsTitle>Category</DetailsTitle>
                <Link to={`..?ai=${!bot.is_deterministic}`}>
                  <Badge variant="info">
                    {bot.is_deterministic ? 'Deterministic' : 'Uses AI'}
                  </Badge>
                </Link>
              </Flex>
            </Details>
            <Flex direction="column" className="gap-4 px-4">
              {bot.paths.length ? (
                <Flex wrap="wrap" className="gap-2">
                  <DetailsTitle className="gap-1">
                    <Tooltip body="The files paths of the codebase this bot is restricted to">
                      <Question />
                    </Tooltip>
                    Paths:
                  </DetailsTitle>
                  {bot.paths.map((path, index) => (
                    <Badge key={index} size="large">
                      {path}
                    </Badge>
                  ))}
                </Flex>
              ) : null}
              <Description>
                <Editor editable={false} value={bot.description} />
              </Description>
            </Flex>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default PublicBot;
