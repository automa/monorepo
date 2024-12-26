import { HTMLAttributes, InputHTMLAttributes } from 'react';

import { $, Component, Styled } from 'theme';

type InputProps = $<
  {},
  {
    error?: string;
  },
  {
    label: string;
    description?: string;
    input: InputHTMLAttributes<HTMLInputElement> & {
      name: string;
    };
  } & HTMLAttributes<HTMLDivElement>
>;

export type InputComponentProps = Component<InputProps>;

export type InputStyledProps = Styled<InputProps>;
