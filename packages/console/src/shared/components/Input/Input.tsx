import React from 'react';
import * as Label from '@radix-ui/react-label';

import Flex from '../Flex';
import Typography from '../Typography';

import { InputComponentProps } from './types';

import { Control, Text } from './Input.styles';

const Input: React.FC<InputComponentProps> = ({
  label,
  optional,
  description,
  error,
  input,
  ...props
}) => {
  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label.Root htmlFor={input.name}>
        <Typography className="font-semibold lg:font-semibold">
          {label}
          {!optional && <span className="text-red-600">&nbsp;*</span>}
        </Typography>
      </Label.Root>
      <Control $error={error} id={input.name} {...input} />
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default Input;
