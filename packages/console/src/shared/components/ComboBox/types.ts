import { HTMLAttributes, Key } from 'react';
import * as Popover from '@radix-ui/react-popover';

import { $, Component, Styled } from 'theme';

export type ComboBoxOption = { id: Key; value: string; disabled?: boolean };

type ComboBoxProps<T extends ComboBoxOption> = $<
  {},
  {
    error?: string;
  },
  {
    side?: Popover.PopoverContentProps['side'];
    sideOffset?: Popover.PopoverContentProps['sideOffset'];
    align?: Popover.PopoverContentProps['align'];
    alignOffset?: Popover.PopoverContentProps['alignOffset'];
    label: string;
    optional?: boolean;
    description?: string;
    name: string;
    value?: Key;
    onChange: (value: Key) => void;
    disabled?: boolean;
    placeholder?: string;
    emptyText: string;
    loading?: boolean;
    options: T[];
    renderOption: (option: T) => JSX.Element;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>
>;

export type ComboBoxComponentProps<T extends ComboBoxOption> = Component<
  ComboBoxProps<T>
>;

export type ComboBoxStyledProps<T extends ComboBoxOption> = Styled<
  ComboBoxProps<T>
>;
