import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { LabelProps } from './types';

const Label: React.FC<LabelProps> = ({ label, optional, name, ...props }) => {
  return (
    <LabelPrimitive.Root {...props} htmlFor={name}>
      {label}
      {!optional && '*'}
    </LabelPrimitive.Root>
  );
};

export default Label;
