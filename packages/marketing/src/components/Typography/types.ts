import { ElementType, HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { AnchorProps } from '../Anchor';

import { typography } from './Typography.cva';

type TypographyProps = $<
  {},
  VariantProps<typeof typography>,
  {
    element?: Omit<ElementType, 'a' | 'button'>;
  } & Omit<AnchorProps, 'children'> &
    HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Component<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
