import { HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { badge } from './Badge.cva';

type BadgeProps = $<
  {},
  VariantProps<typeof badge>,
  HTMLAttributes<HTMLDivElement>
>;

export type BadgeComponentProps = Component<BadgeProps>;

export type BadgeStyledProps = Styled<BadgeProps>;
