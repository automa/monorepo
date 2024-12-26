import React from 'react';

import Label from '../Label';

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
      <Label label={label} optional={optional} name={input.name} />
      <Control $error={error} id={input.name} required={!optional} {...input} />
      <Text variant="small" $error={error}>
        {error ? error : description}
      </Text>
    </Container>
  );
};

export default Input;
