import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';
import { LinkProps } from 'next/link';

import { $, Component, Styled } from 'theme';

import { button } from './Button.cva';

type ButtonProps = $<
  {},
  {
    fullWidth?: boolean;
  } & VariantProps<typeof button>,
  Pick<LinkProps, 'href'> & ButtonHTMLAttributes<HTMLButtonElement>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
