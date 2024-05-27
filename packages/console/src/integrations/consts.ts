import { FC, SVGProps } from 'react';

import { IntegrationType } from '@automa/common';

import GithubLogo from 'assets/logos/github.svg?react';
import LinearLogo from 'assets/logos/linear.svg?react';
import SlackLogo from 'assets/logos/slack.svg?react';
import JiraLogo from 'assets/logos/jira.svg?react';

type Integration = {
  logo: FC<SVGProps<SVGSVGElement>>;
  name: string;
  description: string;
  disabled?: boolean;
};

export const integrations: {
  [key in IntegrationType]: Integration;
} = {
  [IntegrationType.Github]: {
    logo: GithubLogo,
    name: 'GitHub',
    description:
      'Connect your GitHub account to provide access to your code repositories and creating tasks from issues and pull requests.',
  },
  [IntegrationType.Linear]: {
    logo: LinearLogo,
    name: 'Linear',
    description: 'Connect your Linear account to create tasks from issues.',
  },
  [IntegrationType.Slack]: {
    logo: SlackLogo,
    name: 'Slack',
    description:
      'Connect your Slack account to receive notifications and create tasks from messages.',
    disabled: true,
  },
  [IntegrationType.Jira]: {
    logo: JiraLogo,
    name: 'Jira',
    description: 'Connect your Jira account to create tasks from issues.',
    disabled: true,
  },
};
