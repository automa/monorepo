import { FC, SVGProps } from 'react';

import { ProviderType } from '@automa/common';

import GithubLogo from 'assets/logos/github.svg?react';
import GitlabLogo from 'assets/logos/gitlab.svg?react';

type Provider = {
  logo: FC<SVGProps<SVGSVGElement>>;
  name: string;
  disabled?: boolean;
};

export const providers: {
  [key in ProviderType]: Provider;
} = {
  [ProviderType.Github]: {
    logo: GithubLogo,
    name: 'GitHub',
  },
  [ProviderType.Gitlab]: {
    logo: GitlabLogo,
    name: 'GitLab',
    disabled: true,
  },
};
