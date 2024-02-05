import { HTMLAttributes } from 'react';
import { FallbackProps } from 'react-error-boundary';

import { $, Component, Styled } from 'theme';

type ErrorCardProps = $<
  {},
  {},
  {} & FallbackProps & HTMLAttributes<HTMLDivElement>
>;

export type ErrorCardComponentProps = Component<ErrorCardProps>;

export type ErrorCardStyledProps = Styled<ErrorCardProps> &
  HTMLAttributes<HTMLDivElement>;
