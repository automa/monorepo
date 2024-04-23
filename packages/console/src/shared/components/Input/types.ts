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
    description?: string;
    input: InputHTMLAttributes<HTMLInputElement>;
  } & HTMLAttributes<HTMLDivElement>
>;

export type InputComponentProps = Component<InputProps>;

export type InputStyledProps = Styled<InputProps>;
