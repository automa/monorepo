import React, { ReactNode } from 'react';

import { IntegrationType } from '@automa/common';

import { Typography } from 'shared';

import LinearLogo from 'assets/logos/linear.svg?react';

type OriginDefinition = {
  title: (data: any) => ReactNode;
  link: (data: any) => string;
};

export const originDefinitions: Partial<
  Record<IntegrationType, OriginDefinition>
> = {
  [IntegrationType.Linear]: {
    title: (data) => (
      <>
        <LinearLogo className="ml-0.5 size-3" />
        <Typography variant="small">{data.issueIdentifier}</Typography>
        <Typography variant="small">{data.issueTitle}</Typography>
      </>
    ),
    link: (data) => data.url,
  },
};
