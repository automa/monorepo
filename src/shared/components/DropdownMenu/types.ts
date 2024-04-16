import { HTMLAttributes, ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { $, Component, Styled } from 'theme';

type DropdownMenuProps = $<
  {},
  {},
  {
    side?: DropdownMenu.DropdownMenuContentProps['side'];
    sideOffset?: DropdownMenu.DropdownMenuContentProps['sideOffset'];
    align?: DropdownMenu.DropdownMenuContentProps['align'];
    alignOffset?: DropdownMenu.DropdownMenuContentProps['alignOffset'];
    arrowPadding?: DropdownMenu.DropdownMenuContentProps['arrowPadding'];
    trigger: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
>;

export type DropdownMenuComponentProps = Component<DropdownMenuProps>;

export type DropdownMenuStyledProps = Styled<DropdownMenuProps>;
