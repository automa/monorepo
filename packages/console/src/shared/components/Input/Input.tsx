import React from 'react';

import Flex from '../Flex';
import Label from '../Label';

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
      <Label label={label} optional={optional} name={input.name} />
      <Control $error={error} id={input.name} required={!optional} {...input} />
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default Input;
