import React from 'react';

import { Flex } from 'components';

import { AgentBadgesProps } from './types';

import { Badge } from './AgentBadges.styles';

const AgentBadges: React.FC<AgentBadgesProps> = ({ bot, ...props }) => {
  return (
    <Flex className="gap-2" {...props}>
      {bot.is_preview && (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
          Beta
        </Badge>
      )}
      <Badge
        className={
          bot.is_deterministic
            ? 'border-green-200 bg-green-100 text-green-800'
            : 'border-blue-200 bg-blue-100 text-blue-800'
        }
      >
        {bot.is_deterministic ? 'Deterministic' : 'Uses AI'}
      </Badge>
      <Badge>{bot.type === 'manual' ? 'Manual' : 'Scheduled'}</Badge>
    </Flex>
  );
};

export default AgentBadges;
