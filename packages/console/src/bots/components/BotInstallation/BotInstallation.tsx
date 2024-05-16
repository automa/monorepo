import React from 'react';

import { getFragment } from 'gql';

import { BotInstallationProps } from './types';

import { BOT_INSTALLATION_FRAGMENT } from './BotInstallation.queries';
import { Container } from './BotInstallation.styles';

const BotInstallation: React.FC<BotInstallationProps> = ({
  botInstallation: data,
  ...props
}) => {
  const botInstallation = getFragment(BOT_INSTALLATION_FRAGMENT, data);

  return (
    <Container {...props}>
      {botInstallation.bot.org.name}/{botInstallation.bot.name}
    </Container>
  );
};

export default BotInstallation;
