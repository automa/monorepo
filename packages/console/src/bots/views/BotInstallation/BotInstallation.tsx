import React from 'react';
import { useParams } from 'react-router-dom';

import { useAnalyticsPage } from 'analytics';

import { BotInstallationProps } from './types';

import { Container } from './BotInstallation.styles';

const BotInstallation: React.FC<BotInstallationProps> = () => {
  const { botOrgName, botName } = useParams();

  useAnalyticsPage('Bots', 'Bot Installation Overview', {
    botOrgName,
    botName,
  });

  return <Container></Container>;
};

export default BotInstallation;
