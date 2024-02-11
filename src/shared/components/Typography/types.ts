import { ElementType, HTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { typography } from './Typography.cva';

type TypographyProps = $<
  {},
  {
    link?: boolean;
  } & VariantProps<typeof typography>,
  {
    element?: ElementType;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Component<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
