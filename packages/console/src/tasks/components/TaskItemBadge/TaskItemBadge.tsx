import React from 'react';

import { Anchor, Typography } from 'shared';
import HoverCard from 'shared/components/HoverCard';

import { TaskItemBadgeComponentProps } from './types';
import { getBadgeDefinition } from './utils';

import { Container, Content } from './TaskItemBadge.styles';

const TaskItemBadge: React.FC<TaskItemBadgeComponentProps> = ({
  taskItem,
  linkPrefix = '',
  variant,
  ...props
}) => {
  const definition = getBadgeDefinition(taskItem, linkPrefix);

  if (!definition) {
    return null;
  }

  const logo =
    typeof definition.logo === 'function'
      ? definition.logo(taskItem)
      : definition.logo;

  return (
    <Container {...props}>
      <HoverCard
        side="top"
        trigger={
          <Anchor
            {...{
              to: definition.to?.(taskItem),
              href: definition.href?.(taskItem),
              blank: true,
            }}
          >
            <Content $variant={variant}>
              <div className="size-3">{logo}</div>
              <Typography variant="xsmall" className="text-neutral-600">
                {definition.title(taskItem)}
              </Typography>
            </Content>
          </Anchor>
        }
      >
        {definition.content(taskItem)}
      </HoverCard>
    </Container>
  );
};

export default TaskItemBadge;
