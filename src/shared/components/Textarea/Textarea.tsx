import React from 'react';
import * as Label from '@radix-ui/react-label';

import { TextareaComponentProps } from './types';

import { Container, Control } from './Textarea.styles';

const Textarea: React.FC<TextareaComponentProps> = ({
  label,
  optional,
  error,
  textarea,
  ...props
}) => {
  return (
    <Container {...props}>
      <Label.Root htmlFor={textarea.name}>
        {label}
        {!optional && '*'}
      </Label.Root>
      <Control $error={error} id={textarea.name} {...textarea} />
      {error && error}
    </Container>
  );
};

export default Textarea;
