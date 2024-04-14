import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipComponentProps } from './types';

import { Container, Content, Arrow } from './Tooltip.styles';

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
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <Content {...{ side, sideOffset, align, alignOffset, arrowPadding }}>
          {body}
        </Content>
      </TooltipPrimitive.Root>
    </Container>
  );
};

export default Tooltip;
