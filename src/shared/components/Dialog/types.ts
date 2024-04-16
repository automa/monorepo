import { HTMLAttributes, ReactNode } from 'react';

import { $, Component, Styled } from 'theme';

type DialogProps = $<
  {},
  {},
  {
    trigger: ReactNode;
    title: ReactNode;
    description?: ReactNode;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'title'>
>;

export type DialogComponentProps = Component<DialogProps>;

export type DialogStyledProps = Styled<DialogProps>;
