import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ComponentProps } from 'react';
import Link from 'next/link';

import { $, Component, Styled } from 'theme';

import { button } from './Button.cva';

type LinkProps = ComponentProps<typeof Link>;

type ButtonProps = $<
  {},
  {
    fullWidth?: boolean;
  } & VariantProps<typeof button>,
  {
    href?: LinkProps['href'];
    link?: Omit<LinkProps, 'href'>;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
