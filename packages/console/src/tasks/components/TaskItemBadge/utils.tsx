import React, { ReactNode } from 'react';

import { IntegrationType } from '@automa/common';

import { Flex, Typography } from 'shared';

import LinearLogo from 'assets/logos/linear.svg?react';

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
    logo: <LinearLogo />,
    title: (data) => data.issueIdentifier,
    link: (data) => data.url,
    content: (data) => (
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-1">
          <LinearLogo className="size-3" />
          <Typography variant="xsmall" className="text-neutral-800">
            {data.issueIdentifier}
          </Typography>
        </Flex>
        <Typography variant="xsmall" className="text-neutral-600">
          {data.issueTitle}
        </Typography>
      </Flex>
    ),
  },
};
