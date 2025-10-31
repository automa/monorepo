import React, { KeyboardEvent, useRef, useState } from 'react';
import { X } from '@phosphor-icons/react';

import { Flex, Label } from 'shared';

import { InputPathsComponentProps } from './types';

import { Container, Control, Tag, TagX, Text } from './InputPaths.styles';

const InputPaths: React.FC<InputPathsComponentProps> = ({
  label,
  optional,
  description,
  error,
  disabled,
  name,
  value,
  onChange,
  placeholder,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');
  const [focus, setFocus] = useState(false);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const addTag = () => {
    const tag = input.trim();

    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }

    if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={optional} name={name} />
      <Container
        direction="column"
        $error={error}
        $disabled={disabled}
        $focus={focus}
        onClick={handleContainerClick}
        data-testid={`InputPaths-${name}`}
      >
        {value.length ? (
          <Flex wrap="wrap" className="gap-1">
            {value.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <TagX
                  tabIndex={-1}
                  data-testid={`InputPathsX-${tag}`}
                  onClick={() => removeTag(tag)}
                >
                  <X />
                </TagX>
              </Tag>
            ))}
          </Flex>
        ) : null}
        <Control
          ref={inputRef}
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <Text variant="xsmall">
          Press enter or comma after each value to add it to the list.
        </Text>
      </Container>
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default InputPaths;
