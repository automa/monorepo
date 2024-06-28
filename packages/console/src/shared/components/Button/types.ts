import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { AnchorProps } from '../Anchor';

import { button } from './Button.cva';

type ButtonProps = $<
  {},
  {
    fullWidth?: boolean;
  } & VariantProps<typeof button>,
  Omit<AnchorProps, 'disabled' | 'onClick'> &
    ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
