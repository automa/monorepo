import React from 'react';
import * as Label from '@radix-ui/react-label';

import Flex from '../Flex';
import Typography from '../Typography';

import { TextareaComponentProps } from './types';

import { Control, Text } from './Textarea.styles';

const Textarea: React.FC<TextareaComponentProps> = ({
  label,
  optional,
  description,
  error,
  textarea,
  ...props
}) => {
  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label.Root htmlFor={textarea.name}>
        <Typography className="font-semibold lg:font-semibold">
          {label}
          {!optional && <span className="text-red-600">&nbsp;*</span>}
        </Typography>
      </Label.Root>
      <Control $error={error} id={textarea.name} {...textarea} />
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default Textarea;
