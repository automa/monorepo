import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
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

  const [values, setValues] = useState(value ?? []);
  const [input, setInput] = useState('');
  const [focus, setFocus] = useState(false);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const addTag = () => {
    const tag = input.trim();

    if (tag && !values.includes(tag)) {
      setValues([...values, tag]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValues(values.filter((tag) => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }

    if (e.key === 'Backspace' && !input && values.length) {
      removeTag(values[values.length - 1]);
    }
  };

  useEffect(() => {
    onChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={optional} name={name} />
      <Container
        direction="column"
        $error={error}
        $disabled={disabled}
        $focus={focus}
        onClick={handleContainerClick}
      >
        {values.length ? (
          <Flex wrap="wrap" className="gap-1">
            {values.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <TagX tabIndex={-1} onClick={() => removeTag(tag)}>
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
      </Container>
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default InputPaths;
