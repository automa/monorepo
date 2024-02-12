import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipComponentProps } from './types';

import { Container, Trigger, Content } from './Tooltip.styles';

const Tooltip: React.FC<TooltipComponentProps> = ({
  side,
  sideOffset = 4,
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
          <Trigger>{children}</Trigger>
        </TooltipPrimitive.Trigger>
        <Content
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          arrowPadding={arrowPadding}
        >
          {typeof body === 'string' ? body : body()}
        </Content>
      </TooltipPrimitive.Root>
    </Container>
  );
};

export default Tooltip;
