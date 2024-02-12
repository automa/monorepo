import { HTMLAttributes } from 'react';
import { FallbackProps } from 'react-error-boundary';

export interface ErrorCardProps
  extends FallbackProps,
    HTMLAttributes<HTMLDivElement> {}
