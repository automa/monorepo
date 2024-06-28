import { ElementType, HTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { AnchorProps } from '../Anchor';

import { typography } from './Typography.cva';

type TypographyProps = $<
  {},
  VariantProps<typeof typography>,
  {
    element?: ElementType;
  } & Omit<AnchorProps, 'onClick'> &
    HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Component<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
