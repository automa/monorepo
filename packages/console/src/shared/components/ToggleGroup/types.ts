import { HTMLAttributes, ReactNode } from 'react';
import { type VariantProps } from 'class-variance-authority';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { $, Component, Styled } from 'theme';

import { toggleGroup } from './ToggleGroup.cva';

type ToggleGroupPrimitiveProps =
  | ToggleGroup.ToggleGroupSingleProps
  | ToggleGroup.ToggleGroupMultipleProps;

type ToggleGroupProps = $<
  {},
  VariantProps<typeof toggleGroup>,
  {
    type?: ToggleGroupPrimitiveProps['type'];
    optional?: boolean;
    defaultValue?: ToggleGroupPrimitiveProps['defaultValue'];
    orientation?: ToggleGroupPrimitiveProps['orientation'];
    disabled?: ToggleGroupPrimitiveProps['disabled'];
    onValueChange?: ToggleGroupPrimitiveProps['onValueChange'];
    options: {
      label: string;
      value: string;
      body?: ReactNode;
      disabled?: boolean;
    }[];
  } & Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'>
>;

export type ToggleGroupComponentProps = Component<ToggleGroupProps>;

export type ToggleGroupStyledProps = Styled<ToggleGroupProps>;
