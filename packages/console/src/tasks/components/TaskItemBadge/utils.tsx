import React, { ReactNode } from 'react';

import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

import { Flex, Typography } from 'shared';

import GithubLogo from 'assets/logos/github.svg?react';
import JiraLogo from 'assets/logos/jira.svg?react';
import LinearLogo from 'assets/logos/linear.svg?react';
import Closed from 'assets/proposals/closed.svg?react';
import Merged from 'assets/proposals/merged.svg?react';
import Open from 'assets/proposals/open.svg?react';

import { TaskItemTypeWithData } from 'tasks/types';
import { originBaseDefinitions, proposalBaseDefinitions } from 'tasks/utils';

type BadgeFunction = {
  logo: ReactNode | ((data: TaskItemTypeWithData['data']) => ReactNode);
  title: (data: TaskItemTypeWithData['data']) => ReactNode;
  link: (data: TaskItemTypeWithData['data']) => string;
  content: (data: TaskItemTypeWithData['data']) => ReactNode;
};

const originDefinitions: Partial<Record<IntegrationType, BadgeFunction>> = {
  [IntegrationType.Linear]: {
    logo: <LinearLogo className="size-3" />,
    title: (data) => data.issueIdentifier,
    link: originBaseDefinitions[IntegrationType.Linear]!.link,
    content: (data) => (
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
    title: (data) => data.issueKey,
    link: originBaseDefinitions[IntegrationType.Jira]!.link,
    content: (data) => (
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
    logo: (data) =>
      data.prMerged ? (
        <Merged className="size-3" />
      ) : data.prState === 'closed' ? (
        <Closed className="size-3" />
      ) : (
        <Open className="size-3" />
      ),
    title: (data) => `#${data.prId}`,
    link: proposalBaseDefinitions[ProviderType.Github]!.link,
    content: (data) => (
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-1">
          <GithubLogo className="size-3" />
          <Typography variant="xsmall" className="text-neutral-800">
            {data.repoOrgProviderName} / {data.repoName}
          </Typography>
        </Flex>
        <Typography variant="xsmall" className="text-neutral-600">
          {data.prTitle}
        </Typography>
      </Flex>
    ),
  },
};

export const getBadgeDefinition = ({ type, data }: TaskItemTypeWithData) => {
  if (type === TaskItemType.Origin) {
    return originDefinitions[data.integration];
  }

  if (type === TaskItemType.Proposal) {
    return proposalDefinitions[data.repoOrgProviderType];
  }

  return;
};
