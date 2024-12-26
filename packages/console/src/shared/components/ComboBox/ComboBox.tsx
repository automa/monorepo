import React, { useState } from 'react';
import { CaretUpDown, Check, MagnifyingGlass } from '@phosphor-icons/react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';

import Flex from '../Flex';
import Label from '../Label';
import Loader from '../Loader';

import { ComboBoxComponentProps, ComboBoxOption } from './types';

import {
  Content,
  Empty,
  Group,
  Item,
  List,
  Loading,
  Placeholder,
  Search,
  SearchContainer,
  Text,
  Trigger,
} from './ComboBox.styles';

// TODO: Add support for groups
const ComboBox = <T extends ComboBoxOption>({
  side,
  sideOffset,
  align,
  alignOffset,
  label,
  optional,
  description,
  error,
  name,
  value,
  onChange,
  disabled,
  placeholder,
  emptyText,
  loading,
  options,
  renderOption,
  ...props
}: ComboBoxComponentProps<T>) => {
  const [open, setOpen] = useState(false);

  // Value in prop is `id` of the selected option
  const selectedOption = value
    ? options.find(({ id }) => id === value)
    : undefined;

  return (
    <Flex {...props} fullWidth direction="column" className="gap-2">
      <Label label={label} optional={optional} name={name} />
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <Trigger
          $error={error}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
        >
          <Flex
            inline
            fullWidth
            alignItems="center"
            justifyContent="space-between"
          >
            {selectedOption ? (
              renderOption(selectedOption)
            ) : (
              <Placeholder>{placeholder}</Placeholder>
            )}
            <CaretUpDown />
          </Flex>
        </Trigger>
        <PopoverPrimitive.Portal>
          <Content
            $error={error}
            collisionPadding={0}
            {...{ side, sideOffset, align, alignOffset }}
          >
            <Command>
              <SearchContainer>
                <MagnifyingGlass />
                <Search placeholder="Search" />
              </SearchContainer>
              <List>
                {loading ? (
                  <Loading>
                    <Loader size="small" />
                  </Loading>
                ) : (
                  <>
                    <Empty>{emptyText}</Empty>
                    <Group>
                      {options.map((option) => (
                        <Item
                          key={option.id}
                          value={option.value}
                          disabled={option.disabled}
                          $selected={option.id === selectedOption?.id}
                          onSelect={(currentValue) => {
                            const option = options.find(
                              ({ value }) => value === currentValue,
                            );

                            if (option && option.id !== selectedOption?.id) {
                              onChange(option.id);
                            }

                            setOpen(false);
                          }}
                        >
                          {renderOption(option)}
                          {option.id === value && <Check />}
                        </Item>
                      ))}
                    </Group>
                  </>
                )}
              </List>
            </Command>
          </Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      <Text variant="small" $error={error}>
        {error ? error : description}
      </Text>
    </Flex>
  );
};

export default ComboBox;
