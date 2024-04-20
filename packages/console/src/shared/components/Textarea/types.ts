import { HTMLAttributes, TextareaHTMLAttributes } from 'react';

import { $, Component, Styled } from 'theme';

type TextareaProps = $<
  {},
  {
    error?: string;
  },
  {
    label: string;
    optional?: boolean;
    description?: string;
    textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TextareaComponentProps = Component<TextareaProps>;

export type TextareaStyledProps = Styled<TextareaProps>;
