import React, { ReactNode } from 'react';

import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

import { TaskItemFragment } from 'gql/graphql';
import { Flex, Typography } from 'shared';

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
  link: (item: TaskItemFragment) => string;
  content: (item: TaskItemFragment) => ReactNode;
};

const originDefinitions: Partial<Record<IntegrationType, BadgeFunction>> = {
  [IntegrationType.Linear]: {
    logo: <LinearLogo className="size-3" />,
    title: ({ data }) => data.issueIdentifier,
    link: originBaseDefinitions[IntegrationType.Linear]!.link,
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
    link: originBaseDefinitions[IntegrationType.Jira]!.link,
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
    title: ({ data }) => `#${data.prId}`,
    link: proposalBaseDefinitions[ProviderType.Github]!.link,
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

export const getBadgeDefinition = (item: TaskItemFragment) => {
  if (item.type === TaskItemType.Origin) {
    return originDefinitions[item.data.integration as IntegrationType];
  }

  if (item.type === TaskItemType.Proposal) {
    return proposalDefinitions[item.repo!.org.provider_type];
  }

  return;
};
