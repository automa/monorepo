import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipComponentProps } from './types';

import { Container, TriggerContainer, Content, Arrow } from './Tooltip.styles';

const Tooltip: React.FC<TooltipComponentProps> = ({
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  body,
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <TriggerContainer>{children}</TriggerContainer>
        </TooltipPrimitive.Trigger>
        <Content
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          arrowPadding={arrowPadding}
        >
          {typeof body === 'string' ? body : body()}
          <Arrow offset={8} height={8} width={8} />
        </Content>
      </TooltipPrimitive.Root>
    </Container>
  );
};

export default Tooltip;
