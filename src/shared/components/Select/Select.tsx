import React from 'react';
import { CaretDown, CaretUp, CaretUpDown, Check } from '@phosphor-icons/react';
import * as Label from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';

import Flex from '../Flex';

import { SelectComponentProps } from './types';

import {
  Container,
  Content,
  Group,
  GroupLabel,
  Item,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Text,
  Trigger,
  Value,
} from './Select.styles';

const Select: React.FC<SelectComponentProps> = ({
  side,
  sideOffset,
  align,
  alignOffset,
  label,
  optional,
  description,
  error,
  select,
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      <Label.Root htmlFor={select.name}>
        {label}
        {!optional && '*'}
      </Label.Root>
      <SelectPrimitive.Root
        name={select.name}
        required={select.required}
        disabled={select.disabled}
        value={select.value}
        onValueChange={(value) =>
          select.onChange?.({
            target: { name: select.name, value },
          })
        }
      >
        <Trigger id={select.name} $error={error} disabled={select.disabled}>
          <Flex
            inline
            fullWidth
            alignItems="center"
            justifyContent="space-between"
          >
            <Value placeholder={select.placeholder} />
            <SelectPrimitive.Icon asChild>
              <CaretUpDown />
            </SelectPrimitive.Icon>
          </Flex>
        </Trigger>
        <SelectPrimitive.Portal>
          <Content
            $error={error}
            position="popper"
            collisionPadding={0}
            {...{ side, sideOffset, align, alignOffset }}
          >
            <ScrollUpButton>
              <CaretUp />
            </ScrollUpButton>
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <ScrollDownButton>
              <CaretDown />
            </ScrollDownButton>
          </Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <Text variant="small" $error={error}>
        {error ? error : description}
      </Text>
    </Container>
  );
};

export default Select;

export const SelectGroup = Group;

export const SelectGroupLabel = GroupLabel;

export const SelectSeparator = Separator;

export const SelectItem: React.FC<SelectPrimitive.SelectItemProps> = ({
  children,
  ...props
}) => {
  return (
    <Item {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check />
      </SelectPrimitive.ItemIndicator>
    </Item>
  );
};
