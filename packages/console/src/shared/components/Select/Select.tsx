import React from 'react';
import { CaretDown, CaretUp, CaretUpDown, Check } from '@phosphor-icons/react';
import * as SelectPrimitive from '@radix-ui/react-select';

import Flex from '../Flex';
import Label from '../Label';

import { SelectComponentProps } from './types';

import {
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
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={optional} name={select.name} />
      <SelectPrimitive.Root
        name={select.name}
        required={!optional}
        disabled={select.disabled}
        value={select.value}
        onValueChange={(value) =>
          select.onChange?.({
            target: { name: select.name, value },
          })
        }
      >
        <Trigger $error={error} disabled={select.disabled}>
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
            <SelectPrimitive.Viewport>
              <Flex direction="column" className="gap-1">
                {children}
              </Flex>
            </SelectPrimitive.Viewport>
            <ScrollDownButton>
              <CaretDown />
            </ScrollDownButton>
          </Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <Text variant="xsmall" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
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
      <Flex alignItems="center" justifyContent="space-between" fullWidth>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <Check />
        </SelectPrimitive.ItemIndicator>
      </Flex>
    </Item>
  );
};
