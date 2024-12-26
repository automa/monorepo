import { HTMLAttributes } from 'react';
import * as Select from '@radix-ui/react-select';

import { $, Component, Styled } from 'theme';

type SelectProps = $<
  {},
  {
    error?: string;
  },
  {
    side?: Select.SelectContentProps['side'];
    sideOffset?: Select.SelectContentProps['sideOffset'];
    align?: Select.SelectContentProps['align'];
    alignOffset?: Select.SelectContentProps['alignOffset'];
    label: string;
    description?: string;
    select: {
      name: string;
      value?: string;
      onChange?: (event: {
        target: { name: string; value: string };
      }) => void | boolean | Promise<void | boolean>;
      required?: boolean;
      disabled?: boolean;
      placeholder?: string;
    };
  } & Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'>
>;

export type SelectComponentProps = Component<SelectProps>;

export type SelectStyledProps = Styled<SelectProps>;
