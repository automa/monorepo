import React from 'react';

import Editor from '../Editor';
import Flex from '../Flex';
import Label from '../Label';

import { InputEditorComponentProps } from './types';

import { Content, Text } from './InputEditor.styles';

// TODO: This doesn't work with form reset
const InputEditor: React.FC<InputEditorComponentProps> = ({
  label,
  optional,
  description,
  error,
  name,
  disabled,
  value,
  onChange,
  onChangeAsMarkdown,
  placeholder,
  ...props
}) => {
  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={optional} name={name} />
      <Content $error={error} $disabled={disabled}>
        <Editor
          editable={!disabled}
          value={value}
          onChange={onChange}
          onChangeAsMarkdown={onChangeAsMarkdown}
          placeholder={placeholder}
        />
      </Content>
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default InputEditor;
