import React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { HoverCardComponentProps } from './types';

import { Container, Content } from './HoverCard.styles';

const HoverCardTriggerWrapper = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

HoverCardTriggerWrapper.displayName = 'HoverCardTriggerWrapper';

const HoverCard: React.FC<HoverCardComponentProps> = ({
  side,
  sideOffset = 4,
  align,
  alignOffset,
  arrowPadding,
  trigger,
  children,
  ...props
}) => {
  return (
    <Container {...props} asChild>
      <HoverCardPrimitive.Root>
        <HoverCardPrimitive.Trigger asChild>
          <HoverCardTriggerWrapper>{trigger}</HoverCardTriggerWrapper>
        </HoverCardPrimitive.Trigger>
        <HoverCardPrimitive.Portal>
          <Content {...{ side, sideOffset, align, alignOffset, arrowPadding }}>
            {children}
          </Content>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    </Container>
  );
};

export default HoverCard;
