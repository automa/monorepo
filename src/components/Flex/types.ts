import { ElementType, HTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { flex } from './Flex.cva';

type FlexProps = $<
  {},
  {
    element?: ElementType;
    inline?: boolean;
    fullWidth?: boolean;
  } & VariantProps<typeof flex>,
  HTMLAttributes<HTMLDivElement>
>;

export type FlexComponentProps = Component<FlexProps>;

export type FlexStyledProps = Styled<FlexProps>;
