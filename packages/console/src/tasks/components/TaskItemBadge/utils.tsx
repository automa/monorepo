import React, { ReactNode } from 'react';

import { IntegrationType } from '@automa/common';

import { Flex, Typography } from 'shared';

import JiraLogo from 'assets/logos/jira.svg?react';
import LinearLogo from 'assets/logos/linear.svg?react';

import { originBaseDefinitions } from 'tasks/utils';

import { TaskItemBadgeProps } from './types';

export const definitions: Partial<
  Record<
    IntegrationType,
    {
      logo: ReactNode | ((data: TaskItemBadgeProps['data']) => ReactNode);
      title: (data: TaskItemBadgeProps['data']) => ReactNode;
      link: (data: TaskItemBadgeProps['data']) => string;
      content: (data: TaskItemBadgeProps['data']) => ReactNode;
    }
  >
> = {
  [IntegrationType.Linear]: {
    logo: <LinearLogo className="size-3" />,
    title: originBaseDefinitions[IntegrationType.Linear]!.title,
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
    title: originBaseDefinitions[IntegrationType.Jira]!.title,
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
