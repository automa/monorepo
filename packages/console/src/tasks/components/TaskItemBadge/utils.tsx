import React, { ReactNode } from 'react';

import {
  IntegrationType,
  ProviderType,
  TaskItemFragment,
  TaskItemType,
} from 'gql/graphql';
import { Avatar, Flex, Typography } from 'shared';

import GithubLogo from 'assets/logos/github.svg?react';
import JiraLogo from 'assets/logos/jira.svg?react';
import LinearLogo from 'assets/logos/linear.svg?react';
import Closed from 'assets/proposals/closed.svg?react';
import Merged from 'assets/proposals/merged.svg?react';
import Open from 'assets/proposals/open.svg?react';

import { originBaseDefinitions, proposalBaseDefinitions } from 'tasks/utils';

type BadgeFunction = {
  logo: ReactNode | ((item: TaskItemFragment) => ReactNode);
  title: (item: TaskItemFragment) => ReactNode;
  to?: (item: TaskItemFragment) => string;
  href?: (item: TaskItemFragment) => string;
  content: (item: TaskItemFragment) => ReactNode;
};

const originDefinitions: Partial<Record<IntegrationType, BadgeFunction>> = {
  [IntegrationType.Linear]: {
    logo: <LinearLogo className="size-3" />,
    title: ({ data }) => data.issueIdentifier,
    href: originBaseDefinitions[IntegrationType.Linear]!.link,
    content: ({ data }) => (
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-1">
          <LinearLogo className="size-3" />
          <Typography variant="xsmall" className="text-neutral-800">
            {data.organizationName}
          </Typography>
        </Flex>
        <Typography variant="xsmall" className="text-neutral-600">
          {data.issueTitle}
        </Typography>
      </Flex>
    ),
  },
  [IntegrationType.Jira]: {
    logo: <JiraLogo className="size-3" />,
    title: ({ data }) => data.issueKey,
    href: originBaseDefinitions[IntegrationType.Jira]!.link,
    content: ({ data }) => (
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-1">
          <JiraLogo className="size-3" />
          <Typography variant="xsmall" className="text-neutral-800">
            {data.organizationName}
          </Typography>
        </Flex>
        <Typography variant="xsmall" className="text-neutral-600">
          {data.issueTitle}
        </Typography>
      </Flex>
    ),
  },
};

const proposalDefinitions: Partial<Record<ProviderType, BadgeFunction>> = {
  [ProviderType.Github]: {
    logo: ({ data }) =>
      data.prMerged ? (
        <Merged className="size-3" />
      ) : data.prState === 'closed' ? (
        <Closed className="size-3" />
      ) : (
        <Open className="size-3" />
      ),
    title: ({ data }) => `#${data.prNumber}`,
    href: proposalBaseDefinitions[ProviderType.Github]!.link,
    content: ({ data, repo }) => (
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-1">
          <GithubLogo className="size-3" />
          <Typography variant="xsmall" className="text-neutral-800">
            {repo!.name}
          </Typography>
        </Flex>
        <Typography variant="xsmall" className="text-neutral-600">
          {data.prTitle}
        </Typography>
      </Flex>
    ),
  },
};

export const getBadgeDefinition = (
  item: TaskItemFragment,
  linkPrefix: string,
) => {
  if (item.type === TaskItemType.Origin) {
    return originDefinitions[item.data.integration as IntegrationType];
  }

  if (item.type === TaskItemType.Repo) {
    const logo =
      item.repo!.org.provider_type === ProviderType.Github ? (
        <GithubLogo className="size-3" />
      ) : null;

    return {
      logo,
      title: () => item.repo!.name,
      to: () => `${linkPrefix}../repos/${item.repo!.name}`,
      href: undefined,
      content: () => (
        <Flex direction="column" className="gap-2">
          <Flex alignItems="center" className="gap-1">
            {logo}
            <Typography variant="xsmall" className="text-neutral-600">
              {item.repo!.org.provider_name} / {item.repo!.name}
            </Typography>
          </Flex>
        </Flex>
      ),
    };
  }

  if (item.type === TaskItemType.Bot) {
    // TODO: Shorten automa bot's name
    const botName = `${item.bot!.org.name}/${item.bot!.name}`;

    return {
      logo: (
        <Avatar
          src={item.bot!.image_url ?? null}
          alt={item.bot!.name}
          variant="square"
          size="xxsmall"
        />
      ),
      title: () => botName,
      href: undefined,
      to: () => `${linkPrefix}../bots/${botName}`,
      content: () => (
        <Flex direction="column" className="gap-2">
          <Flex alignItems="center" className="gap-1">
            <Avatar
              src={item.bot!.image_url ?? null}
              alt={item.bot!.name}
              variant="square"
              size="xxsmall"
            />
            <Typography variant="xsmall" className="text-neutral-800">
              {item.bot!.org.name} / {item.bot!.name}
            </Typography>
          </Flex>
          <Typography variant="xsmall" className="text-neutral-600">
            {item.bot!.short_description}
          </Typography>
        </Flex>
      ),
    };
  }

  if (item.type === TaskItemType.Proposal) {
    return proposalDefinitions[item.repo!.org.provider_type];
  }

  return;
};
