import { ButtonHTMLAttributes, Ref } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { AnchorProps } from '../Anchor';

import { button } from './Button.cva';

type ButtonProps = $<
  {},
  {
    fullWidth?: boolean;
  } & VariantProps<typeof button>,
  {
    innerRef?: Ref<HTMLButtonElement>;
  } & Omit<AnchorProps, 'disabled' | 'children'> &
    ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
