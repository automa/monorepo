import { ButtonHTMLAttributes } from 'react';
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
    anchor?: Omit<AnchorProps, 'href' | 'blank' | 'disabled' | 'children'>;
  } & Pick<AnchorProps, 'href' | 'blank'> &
    ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
