import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CaretRight } from '@phosphor-icons/react';

import Flex from '../Flex';

import { DropdownMenuComponentProps } from './types';

import {
  Container,
  Content,
  Group,
  Item,
  Label,
  Separator,
  Sub,
  SubContent,
} from './DropdownMenu.styles';

const DropdownMenu: React.FC<DropdownMenuComponentProps> = ({
  side,
  sideOffset = 4,
  align,
  alignOffset,
  arrowPadding,
  trigger,
  children,
  ...props
}) => {
  return (
    <Container {...props} asChild>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger>{trigger}</DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <Content {...{ side, sideOffset, align, alignOffset, arrowPadding }}>
            <Flex direction="column">{children}</Flex>
          </Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </Container>
  );
};

export default DropdownMenu;

export const DropdownMenuGroup = Group;

export const DropdownMenuItem = Item;

export const DropdownMenuLabel = Label;

export const DropdownMenuSeparator = Separator;

export const DropdownMenuSub: React.FC<DropdownMenuComponentProps> = ({
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  trigger,
  children,
  ...props
}) => {
  return (
    <Sub {...props}>
      <DropdownMenuPrimitive.SubTrigger>
        <Flex
          inline
          fullWidth
          alignItems="center"
          justifyContent="space-between"
        >
          {trigger}
          <CaretRight />
        </Flex>
      </DropdownMenuPrimitive.SubTrigger>
      <DropdownMenuPrimitive.Portal>
        <SubContent {...{ side, sideOffset, align, alignOffset, arrowPadding }}>
          {children}
        </SubContent>
      </DropdownMenuPrimitive.Portal>
    </Sub>
  );
};
