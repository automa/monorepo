import React from 'react';
import * as Label from '@radix-ui/react-label';

import { InputComponentProps } from './types';

import { Container, Control, Text } from './Input.styles';

const Input: React.FC<InputComponentProps> = ({
  label,
  optional,
  description,
  error,
  input,
  ...props
}) => {
  return (
    <Container {...props}>
      <Label.Root htmlFor={input.name}>
        {label}
        {!optional && '*'}
      </Label.Root>
      <Control $error={error} {...input} />
      <Text variant="small" $error={error}>
        {error ? error : description}
      </Text>
    </Container>
  );
};

export default Input;
