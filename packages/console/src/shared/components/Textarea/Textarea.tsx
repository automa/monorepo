import React from 'react';

import Flex from '../Flex';
import Label from '../Label';

import { TextareaComponentProps } from './types';

import { Control, Text } from './Textarea.styles';

const Textarea: React.FC<TextareaComponentProps> = ({
  label,
  description,
  error,
  textarea,
  ...props
}) => {
  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={!textarea.required} name={textarea.name} />
      <Control $error={error} id={textarea.name} {...textarea} />
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default Textarea;
