import { HTMLAttributes, InputHTMLAttributes } from 'react';

import { $, Component, Styled } from 'theme';

type InputProps = $<
  {},
  {
    error?: string;
  },
  {
    label: string;
    optional?: boolean;
    input: InputHTMLAttributes<HTMLInputElement>;
  } & HTMLAttributes<HTMLDivElement>
>;

export type InputComponentProps = Component<InputProps>;

export type InputStyledProps = Styled<InputProps>;
