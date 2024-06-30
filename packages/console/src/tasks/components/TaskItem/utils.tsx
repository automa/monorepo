import React, { ReactNode } from 'react';

import { IntegrationType } from '@automa/common';

import { Flex, Typography } from 'shared';

import LinearLogo from 'assets/logos/linear.svg?react';

export const originDefinitions: Partial<
  Record<
    IntegrationType,
    {
      title: (data: any) => ReactNode;
      link: (data: any) => string;
    }
  >
> = {
  [IntegrationType.Linear]: {
    title: (data) => (
      <Flex alignItems="center" className="gap-1">
        <LinearLogo className="size-3" />
        <Typography variant="xsmall">{data.issueIdentifier}</Typography>
        <Typography variant="xsmall">{data.issueTitle}</Typography>
      </Flex>
    ),
    link: (data) => data.url,
  },
};
