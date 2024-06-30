import { HTMLAttributes, ReactNode } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

import { $, Component, Styled } from 'theme';

type HoverCardProps = $<
  {},
  {},
  {
    side?: HoverCard.HoverCardContentProps['side'];
    sideOffset?: HoverCard.HoverCardContentProps['sideOffset'];
    align?: HoverCard.HoverCardContentProps['align'];
    alignOffset?: HoverCard.HoverCardContentProps['alignOffset'];
    arrowPadding?: HoverCard.HoverCardContentProps['arrowPadding'];
    trigger: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
>;

export type HoverCardComponentProps = Component<HoverCardProps>;

export type HoverCardStyledProps = Styled<HoverCardProps>;
