import React, { FC, ReactNode, SVGProps } from 'react';

import { IntegrationType, ProviderType } from '@automa/common';

import { Typography } from 'shared';

import GithubLogo from 'assets/logos/github.svg?react';
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
