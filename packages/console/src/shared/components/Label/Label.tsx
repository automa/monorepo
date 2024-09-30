import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import Typography from '../Typography';

import { LabelProps } from './types';

const Label: React.FC<LabelProps> = ({ label, optional, name, ...props }) => {
  return (
    <LabelPrimitive.Root {...props} htmlFor={name}>
      <Typography className="font-semibold lg:font-semibold">
        {label}
        {!optional && <span className="text-red-600">&nbsp;*</span>}
      </Typography>
    </LabelPrimitive.Root>
  );
};

export default Label;
