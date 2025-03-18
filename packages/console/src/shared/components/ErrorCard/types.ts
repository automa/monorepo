import { HTMLAttributes } from 'react';
import { type FallbackProps } from 'react-error-boundary';

export interface ErrorCardProps
  extends FallbackProps,
    HTMLAttributes<HTMLDivElement> {}
