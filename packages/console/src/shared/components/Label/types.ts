import { HTMLAttributes } from 'react';

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  label: string;
  optional?: boolean;
  name: string;
}
