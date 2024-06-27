import React, { useCallback, useState } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { ToggleGroupComponentProps } from './types';

import { Container, Item } from './ToggleGroup.styles';

const ToggleGroup: React.FC<ToggleGroupComponentProps> = ({
  type = 'single',
  optional = false,
  defaultValue,
  orientation,
  disabled,
  onValueChange,
  options,
  variant,
  size,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  const change = useCallback(
    (value: string & string[]) => {
      if (!optional && (!value || value.length === 0)) {
        setValue(defaultValue);
        // @ts-ignore
        onValueChange?.(defaultValue);
      } else {
        setValue(value);
        onValueChange?.(value);
      }
    },
    [optional, defaultValue, setValue, onValueChange],
  );

  return (
    <Container {...props} asChild>
      <ToggleGroupPrimitive.Root
        // @ts-ignore
        type={type as ToggleGroupComponentProps['type']}
        orientation={orientation}
        disabled={disabled}
        value={value}
        onValueChange={change}
      >
        {options.map(({ label, value, body, disabled }) => (
          <Item
            $variant={variant}
            $size={size}
            key={value}
            value={value}
            aria-label={label}
            disabled={disabled}
          >
            {body || label}
          </Item>
        ))}
      </ToggleGroupPrimitive.Root>
    </Container>
  );
};

export default ToggleGroup;
