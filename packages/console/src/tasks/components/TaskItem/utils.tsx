import React, { FC, ReactNode, SVGProps } from 'react';

import { IntegrationType, ProviderType, TaskItemFragment } from 'gql/graphql';
import { Typography } from 'shared';

import GithubLogo from 'assets/logos/github.svg?react';
import JiraLogo from 'assets/logos/jira.svg?react';
import LinearLogo from 'assets/logos/linear.svg?react';

import { originBaseDefinitions, proposalBaseDefinitions } from 'tasks/utils';

export const originDefinitions: Partial<
  Record<
    IntegrationType,
    {
      title: (item: TaskItemFragment) => ReactNode;
      link: (item: TaskItemFragment) => string;
    }
  >
> = {
  [IntegrationType.Linear]: {
    title: ({ data }) => (
      <>
        <LinearLogo className="ml-0.5 size-3" />
        <Typography variant="small">{data.issueIdentifier}</Typography>
        <Typography variant="small">{data.issueTitle}</Typography>
      </>
    ),
    link: originBaseDefinitions[IntegrationType.Linear]!.link,
  },
  [IntegrationType.Jira]: {
    title: ({ data }) => (
      <>
        <JiraLogo className="ml-0.5 size-3" />
        <Typography variant="small">{data.issueKey}</Typography>
        <Typography variant="small">{data.issueTitle}</Typography>
      </>
    ),
    link: originBaseDefinitions[IntegrationType.Jira]!.link,
  },
};

export const repoDefinitions: Partial<
  Record<
    ProviderType,
    {
      icon: FC<SVGProps<SVGSVGElement>>;
    }
  >
> = {
  [ProviderType.Github]: {
    icon: GithubLogo,
  },
};

export const proposalDefinitions: Partial<
  Record<
    ProviderType,
    {
      title: (item: TaskItemFragment) => ReactNode;
      link: (item: TaskItemFragment) => string;
    }
  >
> = {
  [ProviderType.Github]: {
    title: ({ data }) => (
      <>
        <GithubLogo className="ml-0.5 size-3" />
        <Typography variant="small">{data.prTitle}</Typography>
      </>
    ),
    link: proposalBaseDefinitions[ProviderType.Github]!.link,
  },
};
