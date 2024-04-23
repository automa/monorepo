import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipComponentProps } from './types';

import { Container, Content, Arrow } from './Tooltip.styles';

const TooltipTriggerWrapper = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

TooltipTriggerWrapper.displayName = 'TooltipTriggerWrapper';

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
    <Container {...props} asChild>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <TooltipTriggerWrapper>{children}</TooltipTriggerWrapper>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <Content {...{ side, sideOffset, align, alignOffset, arrowPadding }}>
            {body}
            <Arrow offset={8} height={8} width={8} />
          </Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </Container>
  );
};

export default Tooltip;
