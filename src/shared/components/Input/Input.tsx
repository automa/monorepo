import React from 'react';
import * as Label from '@radix-ui/react-label';

import { InputComponentProps } from './types';

import { Container, Control } from './Input.styles';

const Input: React.FC<InputComponentProps> = ({
  label,
  optional,
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
      <Control $error={error} id={input.name} {...input} />
      {error && error}
    </Container>
  );
};

export default Input;
