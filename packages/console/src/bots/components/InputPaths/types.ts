import { HTMLAttributes } from 'react';

import { $, Component, Styled } from 'theme';

type InputPathsProps = $<
  {},
  {
    error?: string;
    disabled?: boolean;
  },
  {
    label: string;
    optional?: boolean;
    description?: string;
    name: string;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>
>;

export type InputPathsComponentProps = Component<InputPathsProps>;

export type InputPathsStyledProps = Styled<InputPathsProps>;
