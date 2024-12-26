import React from 'react';

import Label from '../Label';

import { TextareaComponentProps } from './types';

import { Container, Control, Text } from './Textarea.styles';

const Textarea: React.FC<TextareaComponentProps> = ({
  label,
  optional,
  description,
  error,
  textarea,
  ...props
}) => {
  return (
    <Container {...props}>
      <Label label={label} optional={optional} name={textarea.name} />
      <Control
        $error={error}
        id={textarea.name}
        required={!optional}
        {...textarea}
      />
      <Text variant="small" $error={error}>
        {error ? error : description}
      </Text>
    </Container>
  );
};

export default Textarea;
