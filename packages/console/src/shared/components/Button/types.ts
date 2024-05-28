import { VariantProps } from 'class-variance-authority';
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { LinkProps } from 'react-router-dom';

import { $, Component, Styled } from 'theme';

import { button } from './Button.cva';

type ButtonProps = $<
  {},
  {
    fullWidth?: boolean;
  } & VariantProps<typeof button>,
  {
    href?: string;
    anchor?: AnchorHTMLAttributes<HTMLAnchorElement>;
    to?: LinkProps['to'];
    link?: Omit<LinkProps, 'to'>;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
