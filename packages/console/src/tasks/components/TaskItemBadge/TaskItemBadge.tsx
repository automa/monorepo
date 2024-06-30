import React from 'react';

import { Anchor, HoverCard, Typography } from 'shared';

import { TaskItemBadgeProps } from './types';
import { definitions } from './utils';

import { Container, Content } from './TaskItemBadge.styles';

const TaskItemBadge: React.FC<TaskItemBadgeProps> = ({ data, ...props }) => {
  const definition = definitions[data.integration];

  if (!definition) {
    return null;
  }

  const logo =
    typeof definition.logo === 'function'
      ? definition.logo(data)
      : definition.logo;

  return (
    <Container {...props}>
      <HoverCard
        side="top"
        trigger={
          <Anchor href={definition.link(data)} blank>
            <Content>
              <div className="size-3">{logo}</div>
              <Typography variant="xsmall" className="text-neutral-600">
                {definition.title(data)}
              </Typography>
            </Content>
          </Anchor>
        }
      >
        {definition.content(data)}
      </HoverCard>
    </Container>
  );
};

export default TaskItemBadge;
