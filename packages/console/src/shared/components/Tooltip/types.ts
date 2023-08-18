import { HTMLAttributes, ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

import { $, Component, Styled } from 'theme';

export type TooltipProps = $<
  {},
  {},
  {
    side?: Tooltip.TooltipContentProps['side'];
    sideOffset?: Tooltip.TooltipContentProps['sideOffset'];
    align?: Tooltip.TooltipContentProps['align'];
    alignOffset?: Tooltip.TooltipContentProps['alignOffset'];
    arrowPadding?: Tooltip.TooltipContentProps['arrowPadding'];
    body: (() => ReactNode) | string;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TooltipComponentProps = Component<TooltipProps>;

export type TooltipStyledProps = Styled<TooltipProps>;
