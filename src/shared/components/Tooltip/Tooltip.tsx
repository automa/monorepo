import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { CommonWrapper } from 'theme';

import { TooltipComponentProps } from './types';

import {
  Container,
  TriggerContainer,
  ContentContainer,
  Arrow,
} from './Tooltip.styles';

const Tooltip = CommonWrapper<TooltipComponentProps>(
  ({
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    content,
    children,
    ...props
  }) => {
    return (
      <Container {...props}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <TriggerContainer>{children}</TriggerContainer>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            arrowPadding={arrowPadding}
          >
            <ContentContainer>{content()}</ContentContainer>
            <Arrow offset={8} height={8} width={8} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      </Container>
    );
  },
);

export default Tooltip;
